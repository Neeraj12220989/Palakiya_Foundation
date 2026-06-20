import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function main() {
  console.log('Seeding database...');

  // --- Admin ---
  const email = process.env.ADMIN_EMAIL || 'admin@ngo.org';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashed = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || 'NGO Administrator',
      email,
      password: hashed,
    },
  });
  console.log(` Admin ready -> ${email} / ${password}`);

  // --- Programs ---
  const programs = [
    {
      title: 'Public Health Awareness',
      summary: 'Community-driven campaigns for preventive healthcare, hygiene and nutrition.',
      description:
        'Our Public Health Awareness initiative brings preventive healthcare directly to underserved communities. Through mobile health camps, hygiene workshops and nutrition counselling, we empower families to make informed decisions about their well-being. We partner with local health workers to ensure sustainable, culturally relevant impact that reaches every household.',
      category: 'Health',
      icon: 'Stethoscope',
      featured: true,
      order: 1,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Community Outreach',
      summary: 'Reaching the last mile with essential services and support systems.',
      description:
        'Community Outreach is the heartbeat of our work. We mobilise volunteers to connect marginalised families with essential government schemes, clean water access and social support networks. Our field teams build lasting relationships, ensuring no one is left behind on the path to dignity and self-reliance.',
      category: 'Community',
      icon: 'Users',
      featured: true,
      order: 2,
      image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Educational Initiatives',
      summary: 'Bridging learning gaps for children and youth in rural communities.',
      description:
        'Education is the most powerful tool for change. Our learning centres provide supplementary education, digital literacy and life skills to children who would otherwise fall through the cracks. We focus on girl-child education and create safe, inspiring spaces where curiosity and confidence can flourish.',
      category: 'Education',
      icon: 'GraduationCap',
      featured: true,
      order: 3,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Training & Workshops',
      summary: 'Skill-building and livelihood training for sustainable self-reliance.',
      description:
        'We equip women and youth with market-relevant skills through vocational training and entrepreneurship workshops. From tailoring and digital skills to financial literacy, our programs unlock sustainable livelihoods and help communities build a resilient, self-reliant future.',
      category: 'Livelihood',
      icon: 'Briefcase',
      featured: false,
      order: 4,
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Women Empowerment',
      summary: 'Enabling women to lead, earn and make their voices heard.',
      description:
        'Through self-help groups, leadership training and access to micro-finance, we empower women to become changemakers in their own communities. We believe that when a woman rises, an entire community rises with her.',
      category: 'Empowerment',
      icon: 'HeartHandshake',
      featured: false,
      order: 5,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Climate & Environment',
      summary: 'Building climate resilience and protecting natural ecosystems.',
      description:
        'We work alongside communities to promote sustainable agriculture, water conservation and disaster preparedness. Our climate resilience programs help vulnerable families adapt to a changing environment while protecting the ecosystems they depend on.',
      category: 'Environment',
      icon: 'Leaf',
      featured: false,
      order: 6,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  await prisma.program.deleteMany();
  for (const p of programs) {
    await prisma.program.create({ data: { ...p, slug: slugify(p.title) } });
  }
  console.log(`${programs.length} programs seeded`);

  // --- Articles ---
  const articles = [
    {
      title: 'Why Preventive Healthcare Matters for Rural Communities',
      excerpt:
        'Preventive care saves lives and reduces the burden on families. Here is how community health programs make a difference.',
      content:
        'Preventive healthcare is often overlooked in rural communities where access to medical facilities is limited. Yet, simple interventions vaccination drives, hygiene education and regular health screenings can dramatically reduce disease burden.\n\nIn our experience working across villages, we have seen that empowering local health workers creates a ripple effect. When one family adopts better hygiene practices, neighbours follow. When mothers learn about balanced nutrition, child malnutrition rates drop.\n\nThe key is consistency and trust. By embedding our health workers within communities, we ensure that preventive care becomes a way of life, not a one-time event.',
      category: 'Health',
      author: 'Dr. Anjali Sharma',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Digital Literacy: Empowering Women in the Internet Age',
      excerpt:
        'Bridging the digital divide gives rural women new opportunities for income, education and independence.',
      content:
        'Access to technology is no longer a luxury it is a necessity. For rural women, digital literacy opens doors that were previously closed: online marketplaces, government services, and remote learning.\n\nOur digital literacy programs have trained thousands of women to use smartphones, navigate the internet safely, and even start small online businesses. The transformation is remarkable. Women who once depended entirely on others now manage their own finances and advocate for their rights.\n\nDigital empowerment is not just about technology. It is about confidence, agency and the freedom to dream bigger.',
      category: 'Empowerment',
      author: 'Priya Verma',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Community-Led Sanitation: A Model That Works',
      excerpt:
        'When communities take ownership of sanitation, the results are sustainable and transformative.',
      content:
        'Top-down sanitation projects often fail because they ignore the community. Our community-led approach flips this model. We facilitate, but the community decides, builds and maintains.\n\nThrough participatory planning, villages identify their own sanitation needs and contribute labour and local materials. This sense of ownership ensures that toilets are actually used and maintained long after the project ends.\n\nThe impact goes beyond hygiene. Open-defecation-free villages report fewer waterborne diseases, improved school attendance for girls, and a renewed sense of community pride.',
      category: 'Awareness',
      author: 'Rahul Mishra',
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'The Power of Education to Break the Cycle of Poverty',
      excerpt:
        'Education is the single most effective intervention to lift families out of generational poverty.',
      content:
        'When a child receives quality education, the benefits multiply across generations. Educated children grow up to earn more, raise healthier families, and invest in their own children\'s learning.\n\nOur learning centres focus on the most vulnerable first-generation learners and girls who are often pulled out of school. By providing supplementary education, mentorship and nutrition support, we keep children in school and help them thrive.\n\nEducation is not just about literacy. It is about hope, opportunity and the belief that a better future is possible.',
      category: 'Education',
      author: 'NGO Team',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  await prisma.article.deleteMany();
  for (const a of articles) {
    await prisma.article.create({ data: { ...a, slug: slugify(a.title) } });
  }
  console.log(`${articles.length} articles seeded`);

  // --- Gallery ---
  const gallery = [
    { title: 'Health camp in session', category: 'Field Work', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80' },
    { title: 'Community gathering', category: 'Events', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80' },
    { title: 'Awareness campaign', category: 'Campaigns', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80' },
    { title: 'Children learning', category: 'Field Work', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80' },
    { title: 'Volunteers at work', category: 'Field Work', image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=80' },
    { title: 'Distribution drive', category: 'Campaigns', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80' },
    { title: 'Skill workshop', category: 'Events', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80' },
    { title: 'Women self-help group', category: 'Events', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80' },
    { title: 'Tree plantation', category: 'Campaigns', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80' },
  ];

  await prisma.gallery.deleteMany();
  for (const g of gallery) await prisma.gallery.create({ data: g });
  console.log(`${gallery.length} gallery images seeded`);

  // --- Testimonials ---
  const testimonials = [
    {
      name: 'Bandana Devi',
      role: 'Digital Literacy Beneficiary',
      quote:
        'The program gave wings to my dream. Now people appreciate my work. It has given me confidence and a platform to become self-independent.',
      order: 1,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Minita Kumari',
      role: 'Parent, Education Centre',
      quote:
        'After attending the centre, my daughter has significantly improved in her education. The teachers provide wonderful counselling to our children.',
      order: 2,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Mohan Ram',
      role: 'Livelihood Program Member',
      quote:
        'After a long time we did not have to worry about our meals. Seeing my family happy and relieved made all the difference. Now I earn every day.',
      order: 3,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  ];

  await prisma.testimonial.deleteMany();
  for (const t of testimonials) await prisma.testimonial.create({ data: t });
  console.log(`${testimonials.length} testimonials seeded`);

  // --- Achievements ---
  const achievements = [
    {
      title: '750,000+ Lives Impacted',
      description:
        'Reached over three-quarters of a million people across 81,000 villages with healthcare, education and livelihood programs.',
      image: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'National NGO Excellence Award 2023',
      description:
        'Recognised by the national council for outstanding contribution to community health and sustainable development.',
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: '5,000+ Active Volunteers',
      description:
        'Built a passionate community of over five thousand volunteers powering our mission on the ground every day.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: '120+ Programs Delivered',
      description:
        'Successfully designed and delivered more than 120 community programs spanning health, education and the environment.',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=80',
    },
  ];

  await prisma.achievement.deleteMany();
  for (const a of achievements) await prisma.achievement.create({ data: a });
  console.log(`${achievements.length} achievements seeded`);

  // --- Site content (homepage editable fields) ---
  const content = {
    hero_badge: 'Hope in Action since 2010',
    hero_title: 'Empowering Communities for a Healthier Tomorrow',
    hero_subtitle:
      'We are not just an organization we are a living story of change. Together, we build healthier, more equitable and self-reliant communities.',
    hero_cta_primary: 'Support Our Cause',
    hero_cta_secondary: 'Explore Programs',
    about_intro:
      'Our NGO works at the intersection of public health, education and social development. For over a decade we have partnered with marginalised communities to deliver lasting, dignified change leaving no one behind.',
    stat_people: '750000',
    stat_people_label: 'People Reached',
    stat_villages: '81000',
    stat_villages_label: 'Villages Covered',
    stat_programs: '120',
    stat_programs_label: 'Programs Conducted',
    stat_volunteers: '5000',
    stat_volunteers_label: 'Active Volunteers',
    mission:
      'To empower marginalised communities through accessible healthcare, quality education and sustainable livelihoods, enabling every individual to live a life of dignity and self-reliance.',
    vision:
      'A just and equitable world where every community has the resources, knowledge and opportunity to thrive where no one is left behind.',
    cta_title: 'Join us in creating lasting change',
    cta_subtitle:
      'Every contribution, every volunteer hour and every shared story brings us closer to a healthier, more equitable world.',
    contact_address: 'D-25/D, South Extension Part II, New Delhi, 110049, India',
    contact_email: 'info@ngo.org',
    contact_phone: '+91 98765 43210',
    social_facebook: 'https://facebook.com',
    social_twitter: 'https://twitter.com',
    social_instagram: 'https://instagram.com',
    social_linkedin: 'https://linkedin.com',
    org_name: 'Palakiya Foundation',
  };

  for (const [key, value] of Object.entries(content)) {
    await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log(`Site content seeded (${Object.keys(content).length} keys)`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

