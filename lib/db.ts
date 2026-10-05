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

  const insertSocial = db.prepare('INSERT OR IGNORE INTO social_links (platform, display_name, url, enabled, display_order) VALUES (?, ?, ?, 0, ?)');
  insertSocial.run('instagram', 'Instagram', '', 1);
  insertSocial.run('youtube', 'YouTube', '', 2);
  insertSocial.run('facebook', 'Facebook', '', 3);

  const adminColumns = db.prepare('PRAGMA table_info(admin_users)').all() as { name: string }[];
  if (!adminColumns.some((column) => column.name === 'token_version')) {
    db.exec('ALTER TABLE admin_users ADD COLUMN token_version INTEGER NOT NULL DEFAULT 0');
  }

  seedDatabase(db);
  ensureSiteContent(db);
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

  const testimonialCount = db.prepare('SELECT COUNT(*) as c FROM testimonials').get() as { c: number };
  if (testimonialCount.c === 0) {
    db.prepare('INSERT INTO testimonials (customer_name, review, rating, is_active) VALUES (?, ?, ?, ?)').run(
      'Anil Misale',
      'The foam wash and detailing were exceptional! My car looks brand new after their amazing service.',
      5, 1
    );
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

  const galleryCount = db.prepare('SELECT COUNT(*) as c FROM gallery_images').get() as { c: number };
  if (galleryCount.c === 0) {
    const items = [
      { title: 'Premium Foam Wash', category: 'Car Wash', image_url: '/images/service-car-wash.jpg', alt_text: 'Premium foam wash at Euphoria Auto Hub, Pune', display_order: 1 },
      { title: 'Ceramic Coating', category: 'Ceramic', image_url: '/images/service-ceramic.jpg', alt_text: 'Ceramic coating at Euphoria Auto Hub, Pune', display_order: 2 },
      { title: 'PPF Installation', category: 'PPF', image_url: '/images/service-ppf.jpg', alt_text: 'Paint protection film at Euphoria Auto Hub, Pune', display_order: 3 },
      { title: 'Interior Detailing', category: 'Interior', image_url: '/images/service-detailing.jpg', alt_text: 'Interior detailing at Euphoria Auto Hub, Pune', display_order: 4 },
      { title: 'Matte Wrap', category: 'Wraps', image_url: '/images/service-wrap.jpg', alt_text: 'Vehicle wrap at Euphoria Auto Hub, Pune', display_order: 5 },
      { title: 'Machine Polishing', category: 'Polishing', image_url: '/images/service-polishing.jpg', alt_text: 'Machine polishing at Euphoria Auto Hub, Pune', display_order: 6 },
      { title: 'Graphene Coating', category: 'Graphene', image_url: '/images/service-ceramic.jpg', alt_text: 'Graphene coating at Euphoria Auto Hub, Pune', display_order: 7 },
      { title: 'Exterior Detail', category: 'Detailing', image_url: '/images/hero-car.jpg', alt_text: 'Exterior detail at Euphoria Auto Hub, Pune', display_order: 8 },
    ];
    const insertGallery = db.prepare('INSERT INTO gallery_images (title, category, image_url, alt_text, display_order) VALUES (@title, @category, @image_url, @alt_text, @display_order)');
    items.forEach(g => insertGallery.run(g));
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
  if (hero && (hero.heading === "Your Car's Best Friend" || hero.heading === 'Your Car’s Best Friend')) {
    write('hero', {
      ...hero,
      label: 'EUPHORIA AUTO HUB',
      heading: 'Premium Care.\nExceptional Finish.',
      subheading: 'Car Wash • Ceramic Coating • Graphene Coating • Paint Protection • Detailing • Wraps',
      description: hero.description || 'Professional car detailing, paint protection and premium automotive care designed to keep your vehicle looking its absolute best.',
      cta_primary: hero.cta_primary || 'Book Your Service',
      cta_secondary: hero.cta_secondary || 'Explore Services',
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
  if (servicesIntro && servicesIntro.heading === 'Our Services') {
    write('services_intro', {
      ...servicesIntro,
      label: 'Services',
      heading: 'Premium Care For Every Detail',
      description: 'From deep cleaning to advanced surface protection, we treat every vehicle with precision.',
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
