import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.VERCEL
  ? path.join('/tmp', 'euphoria.db')
  : path.join(process.cwd(), 'euphoria.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      token_version INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS homepage_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT UNIQUE NOT NULL,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      short_description TEXT,
      full_description TEXT,
      image TEXT,
      icon TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      category TEXT DEFAULT 'General',
      image_url TEXT NOT NULL,
      alt_text TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      review TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      image TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT,
      email TEXT,
      whatsapp TEXT,
      address TEXT,
      maps_url TEXT,
      hours TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS seo_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT UNIQUE NOT NULL,
      title TEXT,
      description TEXT,
      keywords TEXT,
      og_image TEXT,
      canonical_url TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT,
      email TEXT,
      mobile TEXT,
      message TEXT,
      status TEXT DEFAULT 'New',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      url TEXT DEFAULT '',
      enabled INTEGER NOT NULL DEFAULT 0,
      display_order INTEGER NOT NULL DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      related_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS app_migrations (
      name TEXT PRIMARY KEY,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const galleryColumns = db.prepare('PRAGMA table_info(gallery_images)').all() as { name: string }[];
  if (!galleryColumns.some((column) => column.name === 'show_on_home')) {
    db.exec('ALTER TABLE gallery_images ADD COLUMN show_on_home INTEGER NOT NULL DEFAULT 1');
  }
  const testimonialColumns = db.prepare('PRAGMA table_info(testimonials)').all() as { name: string }[];
  if (!testimonialColumns.some((column) => column.name === 'show_on_home')) {
    db.exec('ALTER TABLE testimonials ADD COLUMN show_on_home INTEGER NOT NULL DEFAULT 1');
  }
  const enquiryColumns = db.prepare('PRAGMA table_info(enquiries)').all() as { name: string }[];
  if (!enquiryColumns.some((column) => column.name === 'is_read')) {
    db.exec('ALTER TABLE enquiries ADD COLUMN is_read INTEGER NOT NULL DEFAULT 0');
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_code TEXT UNIQUE,
      service_name TEXT,
      vehicle_type TEXT,
      booking_date TEXT,
      booking_time TEXT,
      name TEXT,
      phone TEXT,
      email TEXT,
      vehicle_make TEXT,
      vehicle_model TEXT,
      registration_number TEXT,
      notes TEXT,
      status TEXT DEFAULT 'Pending',
      source TEXT DEFAULT 'website',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      email TEXT,
      service TEXT,
      source TEXT,
      message TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  addColumn(db, 'services', 'duration', 'duration TEXT');
  addColumn(db, 'services', 'price', 'price TEXT');
  addColumn(db, 'services', 'show_price', 'show_price INTEGER NOT NULL DEFAULT 0');
  addColumn(db, 'services', 'benefits', 'benefits TEXT');
  addColumn(db, 'testimonials', 'service_name', 'service_name TEXT');
  addColumn(db, 'testimonials', 'is_verified', 'is_verified INTEGER NOT NULL DEFAULT 0');
  addColumn(db, 'testimonials', 'display_order', 'display_order INTEGER NOT NULL DEFAULT 0');
  addColumn(db, 'contact_settings', 'business_name', 'business_name TEXT');
  addColumn(db, 'contact_settings', 'maps_embed', 'maps_embed TEXT');
  addColumn(db, 'contact_settings', 'copyright_text', 'copyright_text TEXT');
  addColumn(db, 'contact_settings', 'logo', 'logo TEXT');
  addColumn(db, 'contact_settings', 'favicon', 'favicon TEXT');
  addColumn(db, 'contact_settings', 'default_cta', 'default_cta TEXT');
  addColumn(db, 'leads', 'vehicle', 'vehicle TEXT');
  addColumn(db, 'leads', 'preferred_date', 'preferred_date TEXT');
  addColumn(db, 'leads', 'preferred_time', 'preferred_time TEXT');
  addColumn(db, 'admin_users', 'reset_hash', 'reset_hash TEXT');
  addColumn(db, 'admin_users', 'reset_expires', 'reset_expires TEXT');

  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      short_description TEXT,
      included TEXT,
      benefits TEXT,
      price TEXT,
      show_price INTEGER NOT NULL DEFAULT 0,
      cta TEXT,
      cta_link TEXT,
      is_featured INTEGER NOT NULL DEFAULT 0,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS before_after (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      category TEXT,
      before_image TEXT,
      after_image TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const insertSocial = db.prepare('INSERT OR IGNORE INTO social_links (platform, display_name, url, enabled, display_order) VALUES (?, ?, ?, 0, ?)');
  insertSocial.run('instagram', 'Instagram', '', 1);
  insertSocial.run('facebook', 'Facebook', '', 2);
  insertSocial.run('youtube', 'YouTube', '', 3);
  insertSocial.run('google', 'Google Business Profile', '', 4);
  insertSocial.run('linkedin', 'LinkedIn', '', 5);
  insertSocial.run('x', 'X', '', 6);

  const adminColumns = db.prepare('PRAGMA table_info(admin_users)').all() as { name: string }[];
  if (!adminColumns.some((column) => column.name === 'token_version')) {
    db.exec('ALTER TABLE admin_users ADD COLUMN token_version INTEGER NOT NULL DEFAULT 0');
  }

  seedDatabase(db);
  ensureSiteContent(db);
  seedManagedContent(db);
  removeSeedPortfolioExamples(db);
}

function addColumn(db: Database.Database, table: string, name: string, definition: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!columns.some((column) => column.name === name)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
  }
}

function seedManagedContent(db: Database.Database) {
  const packageCount = db.prepare('SELECT COUNT(*) as c FROM packages').get() as { c: number };
  if (!packageCount.c) {
    const insert = db.prepare('INSERT INTO packages (name, short_description, cta, cta_link, display_order, is_active, show_price) VALUES (?, ?, ?, ?, ?, 1, 0)');
    [
      ['Essential', 'Premium exterior care for a car that needs a proper clean and finish.', 'Get a quote', '/contact', 1],
      ['Performance', 'Exterior and interior detailing for a cabin and body that both feel finished.', 'Get a quote', '/contact', 2],
      ['Protection', 'Detailing paired with a protection conversation: ceramic, graphene, or film.', 'Get a quote', '/contact', 3],
      ['Ultimate', 'A full plan across wash, correction, protection, and wrap if that is what the car needs.', 'Get a quote', '/contact', 4],
    ].forEach((row) => insert.run(...row));
  }
  const faqCount = db.prepare('SELECT COUNT(*) as c FROM faqs').get() as { c: number };
  if (!faqCount.c) {
    const insert = db.prepare('INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES (?, ?, ?, ?, 1)');
    [
      ['Where is Euphoria Auto Hub?', 'The studio is at MNO 30/2, near Ganpati Mandir, next to the True Value showroom, Bavdhan, Pune 411021.', 'Location', 1],
      ['What are the opening hours?', 'The studio is open from 9:00 AM to 7:00 PM.', 'Hours', 2],
      ['Do you publish prices online?', 'Prices depend on the vehicle and the condition of the paint or interior. Ask the team for a quote on WhatsApp or by phone.', 'Pricing', 3],
      ['Which areas do you serve?', 'The studio is in Bavdhan. Owners also visit from nearby Pune areas including Kothrud, Warje, Baner, Aundh, Pashan, and Paud Road.', 'Service area', 4],
    ].forEach((row) => insert.run(...row));
  }
}

function removeSeedPortfolioExamples(db: Database.Database) {
  const migrationName = 'remove-seeded-portfolio-examples-v2';
  if (db.prepare('SELECT name FROM app_migrations WHERE name = ?').get(migrationName)) return;

  const removeExamples = db.transaction(() => {
    db.prepare('DELETE FROM testimonials WHERE customer_name = ? AND review = ? AND rating = 5 AND is_verified = 0').run(
      'Anil Misale',
      'The foam wash and detailing were exceptional! My car looks brand new after their amazing service.',
    );
    db.prepare('DELETE FROM before_after WHERE title = ? AND description = ? AND before_image = ? AND after_image = ?').run(
      'Studio photographs',
      'These are studio photographs of a wash and a finished car. They are not presented as one customer’s before-and-after pair.',
      '/images/service-car-wash.jpg',
      '/images/hero-car.jpg',
    );

    const seededGallery = [
      ['Premium Foam Wash', 'Car Wash', '/images/service-car-wash.jpg', 'Premium foam wash at Euphoria Auto Hub, Pune'],
      ['Ceramic Coating', 'Ceramic', '/images/service-ceramic.jpg', 'Ceramic coating at Euphoria Auto Hub, Pune'],
      ['PPF Installation', 'PPF', '/images/service-ppf.jpg', 'Paint protection film at Euphoria Auto Hub, Pune'],
      ['Interior Detailing', 'Interior', '/images/service-detailing.jpg', 'Interior detailing at Euphoria Auto Hub, Pune'],
      ['Matte Wrap', 'Wraps', '/images/service-wrap.jpg', 'Vehicle wrap at Euphoria Auto Hub, Pune'],
      ['Machine Polishing', 'Polishing', '/images/service-polishing.jpg', 'Machine polishing at Euphoria Auto Hub, Pune'],
      ['Graphene Coating', 'Graphene', '/images/service-ceramic.jpg', 'Graphene coating at Euphoria Auto Hub, Pune'],
      ['Exterior Detail', 'Detailing', '/images/hero-car.jpg', 'Exterior detail at Euphoria Auto Hub, Pune'],
    ];
    const deleteGalleryExample = db.prepare('DELETE FROM gallery_images WHERE title = ? AND category = ? AND image_url = ?');
    seededGallery.forEach((item) => deleteGalleryExample.run(item[0], item[1], item[2]));
    db.prepare('INSERT INTO app_migrations (name) VALUES (?)').run(migrationName);
  });

  removeExamples();
}

function seedDatabase(db: Database.Database) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@euphoriaautohub.in';
  const adminExists = db.prepare('SELECT id FROM admin_users WHERE email = ?').get(adminEmail);
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (!adminExists && initialPassword) {
    const hash = bcrypt.hashSync(initialPassword, 12);
    db.prepare('INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)').run(
      adminEmail, hash, 'Euphoria Admin'
    );
  }

  const contactExists = db.prepare('SELECT id FROM contact_settings LIMIT 1').get();
  if (!contactExists) {
    db.prepare('INSERT INTO contact_settings (phone, email, whatsapp, address, maps_url, hours) VALUES (?, ?, ?, ?, ?, ?)').run(
      '+91 9422445556',
      'pranit.more007@gmail.com',
      '+919422445556',
      'Mno 30/2, Euphoria Auto Hub, Pune, Bavdhan, Pune - 411021 (Near Ganpati Mandir, Next True Value Showroom)',
      'https://maps.app.goo.gl/wu66e8r4i5hMh8cCA',
      'All Day: 9:00 AM – 7:00 PM'
    );
  }

  const seoExists = db.prepare('SELECT id FROM seo_settings WHERE page = ?').get('home');
  if (!seoExists) {
    db.prepare('INSERT INTO seo_settings (page, title, description, keywords) VALUES (?, ?, ?, ?)').run(
      'home',
      'Euphoria Auto Hub | Premium Car Wash, PPF, Ceramic & Detailing in Pune',
      "Euphoria Auto Hub — Your Car's Best Friend. Premium car wash, Paint Protection Film (PPF), Ceramic & Graphene Coatings, Detailing & Interior Cleaning, Wrap Jobs, and Polishing in Pune, Bavdhan.",
      'car wash pune, PPF pune, ceramic coating pune, graphene coating, car detailing pune, wrap jobs pune, paint protection film, euphoria auto hub'
    );
  }

  const serviceCount = db.prepare('SELECT COUNT(*) as c FROM services').get() as { c: number };
  if (serviceCount.c === 0) {
    const services = [
      { name: 'Premium Car Wash', slug: 'premium-car-wash', short_description: "Restore your car's original shine with our professional foam washing process.", full_description: "Experience a thorough foam wash that removes dirt and grime, leaving your car sparkling clean. Our paint-safe cleaning process uses high-quality foam and professional techniques to restore your car's original appearance effortlessly. Every nook is treated with care, ensuring a spotless finish that enhances your vehicle's shine.", image: '/images/service-car-wash.jpg', icon: 'droplets', display_order: 1, is_featured: 0 },
      { name: 'Ceramic & Graphene Coatings', slug: 'ceramic-graphene-coatings', short_description: 'Advanced paint protection with long-lasting shine, hydrophobic properties, and UV resistance.', full_description: "Protect your vehicle's paint with our advanced ceramic and graphene coatings for long-lasting shine and durability. Features include hydrophobic water-repelling properties, UV protection, chemical resistance, enhanced gloss, and long-lasting protection that keeps your car looking showroom-fresh.", image: '/images/service-ceramic.jpg', icon: 'shield', display_order: 2, is_featured: 1 },
      { name: 'Detailing & Interior Cleaning', slug: 'detailing-interior-cleaning', short_description: 'Complete exterior detailing and deep interior cleaning for a showroom-fresh finish.', full_description: 'Our comprehensive detailing service covers every aspect of your vehicle. Exterior detailing restores paint brilliance, while interior cleaning includes thorough vacuuming, upholstery cleaning, dashboard and console cleaning, window cleaning, and odor removal — leaving your car looking and feeling brand new.', image: '/images/service-detailing.jpg', icon: 'sparkles', display_order: 3, is_featured: 0 },
      { name: 'Paint Protection Film (PPF)', slug: 'paint-protection-film', short_description: 'Clear, durable film that shields your paint from road debris, UV rays, and minor abrasions.', full_description: "Paint Protection Film (PPF) is a clear, durable, and flexible polyurethane film applied to the exterior surfaces of your vehicle. It protects against road debris, UV rays, chemical stains, and minor abrasions without altering the vehicle's appearance. PPF preserves your paint for the long term.", image: '/images/service-ppf.jpg', icon: 'shield-check', display_order: 4, is_featured: 1 },
      { name: 'Wrap Jobs', slug: 'wrap-jobs', short_description: 'Full and partial vehicle wraps in gloss, matte, satin, and custom graphic finishes.', full_description: "Car wrapping covers a vehicle's exterior with a large vinyl decal or graphic. We offer full wraps, partial wraps, colour change wraps, and graphic wraps in various finishes including gloss, matte, and satin. Wraps are removable without damaging the underlying paint. A properly applied wrap can last several years with proper care.", image: '/images/service-wrap.jpg', icon: 'palette', display_order: 5, is_featured: 0 },
      { name: 'Polishing', slug: 'polishing', short_description: 'Professional machine polishing to remove swirl marks, scratches, and restore paint clarity.', full_description: 'Our professional polishing service uses advanced machine polishing techniques to remove swirl marks, light scratches, oxidation, and paint defects. We restore your paint to its original deep gloss and clarity using quality compounds and polishing pads — delivering stunning results that make your finish look brand new.', image: '/images/service-polishing.jpg', icon: 'star', display_order: 6, is_featured: 0 }
    ];
    const insertService = db.prepare('INSERT INTO services (name, slug, short_description, full_description, image, icon, display_order, is_featured) VALUES (@name, @slug, @short_description, @full_description, @image, @icon, @display_order, @is_featured)');
    services.forEach(s => insertService.run(s));
  }

  const heroExists = db.prepare('SELECT id FROM homepage_content WHERE section = ?').get('hero');
  if (!heroExists) {
    const sections = [
      { section: 'hero', data: JSON.stringify({ label: 'EUPHORIA AUTO HUB', heading: 'Premium Care.\nExceptional Finish.', subheading: 'Car Wash • Ceramic Coating • Graphene Coating • Paint Protection • Detailing • Wraps', description: 'Professional car detailing, paint protection and premium automotive care designed to keep your vehicle looking its absolute best.', cta_primary: 'Book Your Service', cta_secondary: 'Explore Services', image: '/images/hero-car.jpg' }) },
      { section: 'about', data: JSON.stringify({ heading: 'Care Driven By Precision.', subheading: 'More than a basic wash.', description: 'We believe every vehicle deserves more than a basic wash. Our approach combines professional detailing techniques, premium products and attention to every surface.', quality_badge: 'Premium Products', trust_badge: 'Paint-Safe Process', image: '/images/about-detailing.jpg' }) },
      { section: 'featured_ceramic', data: JSON.stringify({ label: 'Ceramic & Graphene Coatings', heading: 'Protection That Lasts', subheading: 'Ceramic & Graphene Coatings', description: 'A coating is a clear layer of protection that deepens gloss and makes the paint easier to keep clean.', benefits: ['Hydrophobic protection', 'Enhanced gloss', 'Paint protection', 'Easier maintenance', 'Premium finish'], cta: 'Explore Coatings', image: '/images/service-ceramic.jpg' }) },
      { section: 'process', data: JSON.stringify({ heading: 'Our Detailing Process', subheading: 'Five considered steps, from first look to final finish.', steps: [{ number: '01', title: 'Inspect', description: 'We assess the paint, interior and your priorities before any work begins.', active: true }, { number: '02', title: 'Prepare', description: 'Surfaces are washed, decontaminated and masked so the work stays paint-safe.', active: true }, { number: '03', title: 'Detail', description: 'Every panel, wheel and cabin surface is cleaned and corrected with care.', active: true }, { number: '04', title: 'Protect', description: 'Coatings, film or wraps are applied to lock in the result.', active: true }, { number: '05', title: 'Perfect', description: 'A final inspection and handover, so the car leaves finished.', active: true }] }) }
    ];
    const insertSection = db.prepare('INSERT INTO homepage_content (section, data) VALUES (@section, @data)');
    sections.forEach(s => insertSection.run(s));
  }

}

const GALLERY_FILE_REPAIRS: Record<string, { url: string; category: string }> = {
  '/images/gallery-wash-1.jpg': { url: '/images/service-car-wash.jpg', category: 'Car Wash' },
  '/images/gallery-ceramic-1.jpg': { url: '/images/service-ceramic.jpg', category: 'Ceramic' },
  '/images/gallery-ppf-1.jpg': { url: '/images/service-ppf.jpg', category: 'PPF' },
  '/images/gallery-interior-1.jpg': { url: '/images/service-detailing.jpg', category: 'Interior' },
  '/images/gallery-wrap-1.jpg': { url: '/images/service-wrap.jpg', category: 'Wraps' },
  '/images/gallery-polish-1.jpg': { url: '/images/service-polishing.jpg', category: 'Polishing' },
  '/images/gallery-graphene-1.jpg': { url: '/images/service-ceramic.jpg', category: 'Graphene' },
  '/images/gallery-exterior-1.jpg': { url: '/images/hero-car.jpg', category: 'Detailing' },
};

function ensureSiteContent(db: Database.Database) {
  const gallery = db.prepare('SELECT id, title, image_url, alt_text FROM gallery_images').all() as { id: number; title: string; image_url: string; alt_text: string | null }[];
  const fixGallery = db.prepare('UPDATE gallery_images SET image_url = ?, category = ?, alt_text = ? WHERE id = ?');
  for (const row of gallery) {
    const abs = path.join(process.cwd(), 'public', row.image_url.replace(/^\//, ''));
    const repair = GALLERY_FILE_REPAIRS[row.image_url];
    if (repair && !fs.existsSync(abs)) {
      fixGallery.run(repair.url, repair.category, row.alt_text || `${row.title} at Euphoria Auto Hub, Pune`, row.id);
    }
  }

  db.prepare("UPDATE gallery_images SET category = 'Graphene' WHERE title = 'Graphene Coating' AND category = 'Ceramic'").run();
  db.prepare("UPDATE gallery_images SET category = 'Interior' WHERE title = 'Interior Detailing' AND category = 'Detailing'").run();
  db.prepare("UPDATE gallery_images SET alt_text = title || ' at Euphoria Auto Hub, Pune' WHERE alt_text IS NULL OR alt_text = ''").run();

  db.prepare("UPDATE enquiries SET status = 'NEW' WHERE status IN ('New', 'new')").run();
  db.prepare("UPDATE enquiries SET status = 'CONTACTED' WHERE status IN ('Contacted', 'contacted')").run();
  db.prepare("UPDATE enquiries SET status = 'CLOSED' WHERE status IN ('Closed', 'closed')").run();

  db.prepare("UPDATE seo_settings SET canonical_url = 'https://euphoriaautohub.in' WHERE page = 'home' AND (canonical_url IS NULL OR canonical_url = '')").run();

  const insertSection = db.prepare('INSERT INTO homepage_content (section, data) VALUES (?, ?)');
  const sections: Record<string, object> = {
    featured_ppf: {
      label: 'Paint Protection Film',
      heading: 'Invisible Shield. Lasting Protection.',
      description: 'Paint Protection Film (PPF) is a clear, durable polyurethane film applied to the exterior of your vehicle. It protects against road debris, UV rays, chemical stains, and minor abrasions without altering the paint.',
      image: '/images/service-ppf.jpg',
      cta: 'Enquire About PPF',
      benefits: [
        { title: 'Road Debris Protection', description: 'Guards against stone chips, scratches, and impacts.' },
        { title: 'UV Ray Resistance', description: 'Helps prevent paint fading from prolonged sun exposure.' },
        { title: 'Chemical Resistance', description: 'Protects against chemical stains and contamination.' },
        { title: 'Self-Healing', description: 'Minor abrasions can disappear, preserving the paint finish.' },
      ],
    },
    featured_wrap: {
      label: 'Vehicle Wraps',
      heading: 'Transform Your Vehicle',
      description: 'Full wraps, partial wraps, colour changes, and custom graphic wraps in gloss, matte, and satin finishes. A properly applied wrap is removable and can last several years with proper care.',
      cta: 'Explore Wrap Jobs',
      finishes: [
        { label: 'Gloss', description: 'Mirror-like shine' },
        { label: 'Matte', description: 'Understated elegance' },
        { label: 'Satin', description: 'Between gloss and matte' },
        { label: 'Custom', description: 'Your unique vision' },
      ],
    },
    featured_detailing: {
      label: 'Detailing & Interior',
      heading: 'Detailing & Interior Cleaning',
      description: 'Complete exterior detailing and deep interior cleaning. Interior work includes vacuuming, upholstery cleaning, dashboard and console cleaning, window cleaning, and odour removal.',
      image: '/images/service-detailing.jpg',
      cta: 'Book Detailing',
      benefits: ['Exterior detailing', 'Vacuuming', 'Upholstery cleaning', 'Dashboard and console', 'Window cleaning', 'Odour removal'],
    },
    services_intro: {
      label: 'Services',
      heading: 'Premium Care For Every Detail',
      description: 'From deep cleaning to advanced surface protection, we treat every vehicle with precision.',
    },
    gallery_intro: {
      label: 'Gallery',
      heading: 'Our Recent Work',
      description: 'Exterior, interior, coatings and wraps finished in the studio.',
    },
    location: {
      label: 'Find Us',
      heading: 'Visit Our Studio',
    },
    contact_intro: {
      label: 'Get In Touch',
      heading: 'Book Your Service',
      description: "Share your requirements and we'll get back to you promptly with all the details you need.",
    },
  };

  const exists = db.prepare('SELECT id FROM homepage_content WHERE section = ?');
  for (const [section, data] of Object.entries(sections)) {
    if (!exists.get(section)) insertSection.run(section, JSON.stringify(data));
  }

  const heroRow = db.prepare('SELECT data FROM homepage_content WHERE section = ?').get('hero') as { data: string } | undefined;
  if (heroRow) {
    const hero = JSON.parse(heroRow.data);
    let changed = false;
    if (hero.description === undefined) { hero.description = ''; changed = true; }
    if (hero.video === undefined) { hero.video = ''; changed = true; }
    if (changed) db.prepare('UPDATE homepage_content SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE section = ?').run(JSON.stringify(hero), 'hero');
  }

  const ceramicRow = db.prepare('SELECT data FROM homepage_content WHERE section = ?').get('featured_ceramic') as { data: string } | undefined;
  if (ceramicRow) {
    const ceramic = JSON.parse(ceramicRow.data);
    let changed = false;
    if (ceramic.label === undefined) { ceramic.label = 'Advanced Protection'; changed = true; }
    if (ceramic.cta === undefined) { ceramic.cta = 'Get a Quote'; changed = true; }
    if (changed) db.prepare('UPDATE homepage_content SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE section = ?').run(JSON.stringify(ceramic), 'featured_ceramic');
  }

  const processRow = db.prepare('SELECT data FROM homepage_content WHERE section = ?').get('process') as { data: string } | undefined;
  if (processRow) {
    const process = JSON.parse(processRow.data);
    let changed = false;
    if (Array.isArray(process.steps)) {
      process.steps = process.steps.map((step: { active?: boolean; number?: string }, index: number) => {
        if (step.active === undefined) {
          changed = true;
          return { ...step, active: true, number: step.number || String(index + 1).padStart(2, '0') };
        }
        return step;
      });
    }
    if (changed) db.prepare('UPDATE homepage_content SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE section = ?').run(JSON.stringify(process), 'process');
  }

  refreshLaunchCopy(db);
}

function refreshLaunchCopy(db: Database.Database) {
  const read = (section: string) => {
    const row = db.prepare('SELECT data FROM homepage_content WHERE section = ?').get(section) as { data: string } | undefined;
    if (!row) return null;
    try { return JSON.parse(row.data); } catch { return null; }
  };
  const write = (section: string, data: object) => {
    db.prepare('UPDATE homepage_content SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE section = ?').run(JSON.stringify(data), section);
  };

  const hero = read('hero');
  const oldHero = new Set(["Your Car's Best Friend", 'Your Car’s Best Friend', 'Premium Care.\nExceptional Finish.', 'Premium Care. Exceptional Finish.']);
  if (hero && oldHero.has(String(hero.heading || ''))) {
    write('hero', {
      ...hero,
      label: 'Euphoria Auto Hub · Premium automotive care in Pune',
      heading: 'YOUR CAR DESERVES\nMORE THAN A WASH.',
      subheading: 'Premium Automotive Care in Pune',
      description: 'Premium detailing, ceramic and graphene coatings, PPF, wraps and professional car care — crafted for people who care about their cars.',
      cta_primary: 'Book a service',
      cta_primary_link: '/booking',
      cta_secondary: 'WhatsApp us',
      cta_secondary_link: 'whatsapp',
      cta_tertiary: 'Explore services',
      cta_tertiary_link: '/services',
      enabled: true,
      image: hero.image || '/images/hero-car.jpg',
      image_alt: hero.image_alt || 'Finished car at Euphoria Auto Hub, Bavdhan',
    });
  }

  const about = read('about');
  if (about && about.heading === 'Euphoria Auto Hub') {
    write('about', {
      ...about,
      heading: 'Care Driven By Precision.',
      subheading: 'More than a basic wash.',
      description: 'We believe every vehicle deserves more than a basic wash. Our approach combines professional detailing techniques, premium products and attention to every surface.',
      quality_badge: 'Premium Products',
      trust_badge: 'Paint-Safe Process',
    });
  }

  const servicesIntro = read('services_intro');
  if (servicesIntro && (servicesIntro.heading === 'Our Services' || servicesIntro.heading === 'Premium Care For Every Detail')) {
    write('services_intro', {
      ...servicesIntro,
      label: 'Services',
      heading: 'BUILT TO MAKE YOUR CAR LOOK ITS BEST.',
      description: 'Active services from the studio, shown in the order set in admin.',
    });
  }

  const galleryIntro = read('gallery_intro');
  if (galleryIntro && galleryIntro.heading === 'From The Studio') {
    write('gallery_intro', {
      ...galleryIntro,
      label: 'Gallery',
      heading: 'Our Recent Work',
      description: galleryIntro.description || 'Exterior, interior, coatings and wraps finished in the studio.',
    });
  }

  const ceramic = read('featured_ceramic');
  if (ceramic && ceramic.heading === 'PROTECTION THAT SHINES') {
    write('featured_ceramic', {
      ...ceramic,
      label: 'Ceramic & Graphene Coatings',
      heading: 'Protection That Lasts',
      subheading: 'Ceramic & Graphene Coatings',
      description: 'A coating is a clear layer of protection that deepens gloss and makes the paint easier to keep clean.',
      benefits: ['Hydrophobic protection', 'Enhanced gloss', 'Paint protection', 'Easier maintenance', 'Premium finish'],
      cta: 'Explore Coatings',
    });
  }

  const process = read('process');
  const titles = Array.isArray(process?.steps) ? process.steps.map((step: { title?: string }) => step.title).join('|') : '';
  if (process && titles === 'Inspection|Preparation|Professional Service|Final Finish') {
    write('process', {
      ...process,
      heading: 'Our Detailing Process',
      subheading: 'Five considered steps, from first look to final finish.',
      steps: [
        { number: '01', title: 'Inspect', description: 'We assess the paint, interior and your priorities before any work begins.', active: true },
        { number: '02', title: 'Prepare', description: 'Surfaces are washed, decontaminated and masked so the work stays paint-safe.', active: true },
        { number: '03', title: 'Detail', description: 'Every panel, wheel and cabin surface is cleaned and corrected with care.', active: true },
        { number: '04', title: 'Protect', description: 'Coatings, film or wraps are applied to lock in the result.', active: true },
        { number: '05', title: 'Perfect', description: 'A final inspection and handover, so the car leaves finished.', active: true },
      ],
    });
  }
}
