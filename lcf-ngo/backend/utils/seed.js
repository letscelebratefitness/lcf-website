const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const dns = require('dns');

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])

const Admin = require('../models/Admin');
const Page = require('../models/Page');
const Event = require('../models/Event');

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Admin.deleteMany({});
  await Page.deleteMany({});
  await Event.deleteMany({});

  // Create admin
  await Admin.create({
    email: process.env.ADMIN_EMAIL || 'admin@letscelebratefitness.org',
    password: process.env.ADMIN_PASSWORD || 'Admin@LCF2024',
    name: 'LCF Admin'
  });
  console.log('✅ Admin created');

  // ─────────────────────────────────────────
  // HOME PAGE
  // ─────────────────────────────────────────
  await Page.create({
    page: 'home',
    title: "Let's Celebrate Fitness | NGO for Fitness & Social Impact",
    metaDescription: "Let's Celebrate Fitness (LCF) is a non-profit focused on fitness and social impact, serving communities across India.",
    sections: [
      {
        type: 'announcement',
        visible: true,
        order: 1,
        content: {
          text: '80G Approved • CSR Registered • Govt Registered Trust (E-12984) • NGO Darpan Verified • 12A Registered',
          direction: 'left',
          pauseOnHover: true
        }
      },
      {
        type: 'hero',
        visible: true,
        order: 2,
        content: {
          heading: "Fitness That Changes Lives",
          subtext: "Let's Celebrate Fitness is a non-profit organization committed to fitness, community wellness, and uplifting the underprivileged. Together, we run farther, give more, and celebrate life.",
          image: '',
          buttons: [
            { label: 'Join Us', href: '/get-involved', variant: 'primary' },
            { label: 'Our Impact', href: '/impact', variant: 'outline' }
          ]
        }
      },
      {
        type: 'stats',
        visible: true,
        order: 3,
        content: {
          heading: 'Our Numbers Tell the Story',
          stats: [
            { value: '60,00,000+', label: 'Meals Served' },
            { value: '7500+', label: 'Marathon Participants' },
            { value: '2500+', label: 'Women Engaged' },
            { value: '60+', label: 'Marathons Run by Founder' }
          ]
        }
      },
      {
        type: 'about_snippet',
        visible: true,
        order: 4,
        content: {
          heading: "Who We Are",
          text: "Let's Celebrate Fitness (LCF) is a non-profit organization focused on fitness and social impact. What began as a fitness initiative grew into a powerful movement — during lockdown, we stepped up to help underprivileged communities with food and essential supplies.",
          image: '',
          buttonLabel: 'Learn More About Us',
          buttonHref: '/about'
        }
      },
      {
        type: 'initiatives_preview',
        visible: true,
        order: 5,
        content: {
          heading: 'What We Do',
          subtext: 'From marathons to meal drives, our initiatives create lasting social change.',
          initiatives: [
            { icon: '🍱', title: 'Food Distribution', text: 'Providing nutritious meals to underprivileged families and communities.' },
            { icon: '📚', title: 'Education & Sports', text: 'Empowering children through education and sports programs.' },
            { icon: '🏃‍♀️', title: 'Women Fitness Awareness', text: 'Inspiring women to lead active, healthy lives.' },
            { icon: '🌈', title: 'Transgender Support', text: 'Supporting the transgender community through fitness and inclusion.' },
            { icon: '🆘', title: 'Calamity Relief', text: 'Rapid response relief during natural disasters and emergencies.' },
            { icon: '🌱', title: 'Tree Plantation', text: 'Cleanliness drives and tree plantation for a greener tomorrow.' }
          ]
        }
      },
      {
        type: 'founder_snippet',
        visible: true,
        order: 6,
        content: {
          heading: 'Meet Our Founder',
          name: 'Richa Sameet',
          tagline: 'Marathon Runner • Social Activist • Change Maker',
          text: "Richa Sameet has completed 60+ marathons ranging from 21km to 100km. She has participated in the Berlin, Tata Mumbai, and Satara marathons — and has run in a saree to celebrate Indian culture. She works tirelessly for street children and the transgender community.",
          image: '',
          buttonLabel: 'Read Full Story',
          buttonHref: '/about'
        }
      },
      {
        type: 'media',
        visible: true,
        order: 7,
        content: {
          heading: 'Featured In',
          outlets: ['BBC', 'NDTV', 'Times of India', 'Hindustan Times', 'Lokmat']
        }
      },
      {
        type: 'testimonials',
        visible: true,
        order: 8,
        content: {
          heading: 'Voices From The Community',
          subtext: 'Stories that reflect the trust, care, and impact behind every initiative.',
          testimonials: [
            {
              quote: 'LCF did not just organize an event for us. They made our community feel seen, welcomed, and celebrated.',
              name: 'Community Participant',
              role: 'Fitness Event Attendee'
            },
            {
              quote: 'Their work combines discipline, compassion, and consistency. You can feel that this mission is deeply genuine.',
              name: 'Partner Organization',
              role: 'Collaboration Partner'
            }
          ]
        }
      },
      {
        type: 'certificates',
        visible: true,
        order: 9,
        content: {
          heading: 'Certificates & Recognition',
          subtext: 'A snapshot of milestones, honors, and recognitions earned through our work.',
          certificates: [
            {
              title: 'Community Impact Recognition',
              image: '',
              alt: 'Community Impact Recognition certificate'
            },
            {
              title: 'Fitness Leadership Award',
              image: '',
              alt: 'Fitness Leadership Award certificate'
            }
          ]
        }
      },
      {
        type: 'implementation_plan',
        visible: true,
        order: 10,
        content: {
          heading: 'Implementation Plan',
          steps: [
            {
              title: 'Planning and Needs Assessment',
              points: [
                'Conduct surveys and community meetings to identify needs related to food security, sports, education, and climate change.',
                'Partner with local experts, NGOs, and government bodies.'
              ]
            },
            {
              title: 'Resource Allocation and Collaboration',
              points: [
                'Allocate budget efficiently.',
                'Collaborate with authorities, educational institutions, and NGOs.'
              ]
            },
            {
              title: 'Execution and Monitoring',
              points: [
                'Roll out programs as per schedule.',
                'Build infrastructure like community kitchens and learning centers.',
                'Monitor progress using KPIs.'
              ]
            },
            {
              title: 'Evaluation and Reporting',
              points: [
                'Analyze impact data.',
                'Prepare reports for stakeholders and CSR compliance.',
                'Gather feedback for improvement.'
              ]
            },
            {
              title: 'Sustainability and Scale-up',
              points: [
                'Ensure long-term sustainability and community ownership.',
                'Expand successful initiatives to other regions.'
              ]
            }
          ]
        }
      },
      {
        type: 'theory_of_change',
        visible: true,
        order: 11,
        content: {
          heading: 'LCF | Theory of Change',
          categories: [
            {
              label: 'Food',
              intervention: 'Food distribution for underprivileged groups',
              inputs: 'Daily food distribution to needy and homeless',
              outcomes: 'End of hunger',
              impact: 'Healthy and nutritional communities'
            },
            {
              label: 'Sports',
              intervention: 'Football training for municipal & govt schools',
              inputs: 'Skills training, exposure events, fitness',
              outcomes: 'Students gain skills and career exposure',
              impact: 'Improved employability in sports & other careers'
            },
            {
              label: 'Education',
              intervention: 'Support for financially weaker students',
              inputs: 'School fees and educational equipment',
              outcomes: 'Reduced dropout rates',
              impact: 'Improved employability'
            },
            {
              label: 'Climate Change',
              intervention: 'Tree plantation & cleanliness drives',
              inputs: 'Planting and nurturing trees',
              outcomes: 'Better air quality, water conservation',
              impact: 'Reduced carbon footprint'
            }
          ]
        }
      },
      {
        type: 'cta',
        visible: true,
        order: 12,
        content: {
          heading: 'Be Part of the Movement',
          subtext: 'Volunteer, donate, or spread the word. Every action counts.',
          buttons: [
            { label: 'Get Involved', href: '/get-involved', variant: 'primary' },
            { label: 'Contact Us', href: '/contact', variant: 'outline' }
          ]
        }
      }
    ]
  });

  // ─────────────────────────────────────────
  // ABOUT PAGE
  // ─────────────────────────────────────────
  await Page.create({
    page: 'about',
    title: "About Us | Let's Celebrate Fitness",
    sections: [
      {
        type: 'page_hero',
        visible: true,
        order: 1,
        content: {
          heading: "About Let's Celebrate Fitness",
          subtext: "A movement born from passion, powered by purpose.",
          image: ''
        }
      },
      {
        type: 'about_story',
        visible: true,
        order: 2,
        content: {
          heading: "Our Story",
          paragraphs: [
            "Let's Celebrate Fitness (LCF) is a non-profit organization focused on fitness and social impact.",
            "It started as a fitness initiative and expanded during lockdown to help underprivileged communities with food and essentials.",
            "What began as one woman's passion for running has become a community of thousands — united by fitness and a commitment to giving back."
          ],
          image: ''
        }
      },
      {
        type: 'founder_full',
        visible: true,
        order: 3,
        content: {
          heading: 'Our Founder',
          name: 'Richa Sameet',
          image: '',
          highlights: [
            'Marathon runner with 60+ marathons completed (21km to 100km)',
            'Participated in Berlin, Tata Mumbai, and Satara marathons',
            'Ran marathons in saree to promote Indian culture',
            'Works for street children and transgender community'
          ],
          bio: "Richa Sameet is a marathon runner and social activist who has dedicated her life to two powerful missions: promoting fitness and uplifting marginalized communities. With 60+ marathons under her belt — from 21km half marathons to grueling 100km ultras — she is a force of nature both on and off the track."
        }
      },
      {
        type: 'mission_vision',
        visible: true,
        order: 4,
        content: {
          mission: {
            heading: 'Our Mission',
            text: 'To harness the power of fitness as a catalyst for social change — creating healthier communities and uplifting the underprivileged through inclusive, impactful programs.'
          },
          vision: {
            heading: 'Our Vision',
            text: 'A world where fitness is a right, not a privilege — where every individual, regardless of background, can access the transformative power of movement and community.'
          }
        }
      },
      {
        type: 'media_coverage',
        visible: true,
        order: 5,
        content: {
          heading: 'Media Coverage',
          subtext: "Our work has been recognized by leading national and international media.",
          outlets: ['BBC', 'NDTV', 'Times of India', 'Hindustan Times', 'Lokmat']
        }
      }
    ]
  });

  // ─────────────────────────────────────────
  // INITIATIVES PAGE
  // ─────────────────────────────────────────
  await Page.create({
    page: 'initiatives',
    title: "Our Initiatives | Let's Celebrate Fitness",
    sections: [
      {
        type: 'page_hero',
        visible: true,
        order: 1,
        content: {
          heading: 'Our Initiatives',
          subtext: 'Six pillars of impact, one united purpose.',
          image: ''
        }
      },
      {
        type: 'initiatives_grid',
        visible: true,
        order: 2,
        content: {
          initiatives: [
            {
              icon: '🍱',
              title: 'Food Distribution',
              description: 'Providing nutritious meals to underprivileged families and communities. During the COVID-19 lockdown, LCF mobilized volunteers to distribute food to thousands of families who had no other means of sustenance.',
              image: ''
            },
            {
              icon: '📚',
              title: 'Education & Sports',
              description: 'Empowering street children and youth through access to education and sports. We believe that sport is a universal language that breaks barriers and builds character.',
              image: ''
            },
            {
              icon: '🏃‍♀️',
              title: 'Women Fitness Awareness',
              description: 'Running events and workshops to inspire women of all ages and backgrounds to embrace fitness as a path to empowerment, health, and confidence.',
              image: ''
            },
            {
              icon: '🌈',
              title: 'Transgender Support',
              description: 'Creating safe, inclusive spaces for the transgender community through fitness events that foster belonging, dignity, and community support.',
              image: ''
            },
            {
              icon: '🆘',
              title: 'Calamity Relief',
              description: 'Rapid-response relief operations during floods, earthquakes, and other natural disasters — providing food, water, and essential supplies to affected communities.',
              image: ''
            },
            {
              icon: '🌱',
              title: 'Tree Plantation & Cleanliness Drives',
              description: 'Organizing community-led tree plantation drives and cleanliness campaigns to build environmental awareness and civic responsibility.',
              image: ''
            }
          ]
        }
      }
    ]
  });

  // ─────────────────────────────────────────
  // IMPACT PAGE
  // ─────────────────────────────────────────
  await Page.create({
    page: 'impact',
    title: "Our Impact | Let's Celebrate Fitness",
    sections: [
      {
        type: 'page_hero',
        visible: true,
        order: 1,
        content: {
          heading: 'Our Impact',
          subtext: 'Numbers that represent real lives changed.',
          image: ''
        }
      },
      {
        type: 'impact_stats',
        visible: true,
        order: 2,
        content: {
          stats: [
            { value: '60,00,000+', label: 'Meals Served', description: 'Nutritious meals provided to underprivileged families and communities across the region.' },
            { value: '7500+', label: 'Marathon Participants', description: 'Participants engaged through the Swachh Navi Mumbai Marathon and other running events.' },
            { value: '2500+', label: 'Women Engaged', description: "Women inspired to embrace fitness through LCF's Women's Day Fitness Event and ongoing programs." },
            { value: '60+', label: 'Marathons by Founder', description: 'Marathons completed by founder Richa Sameet, ranging from 21km to 100km.' }
          ]
        }
      },
      {
        type: 'events_impact',
        visible: true,
        order: 3,
        content: {
          heading: 'Events by the Numbers',
          events: [
            { name: 'Swachh Navi Mumbai Marathon', participants: '7500+' },
            { name: "Women's Day Fitness Event", participants: '2500+' },
            { name: 'Apollo Fitness Event', participants: '1800' },
            { name: 'Breast Cancer Awareness Event', participants: '2000' },
            { name: 'Transgender Fitness Event', participants: '800' }
          ]
        }
      },
      {
        type: 'testimonials',
        visible: true,
        order: 4,
        content: {
          heading: 'Impact In Their Words',
          subtext: 'The most meaningful measure of impact is often what people carry home from the experience.',
          testimonials: [
            {
              quote: 'The event gave me confidence, motivation, and a sense of belonging. It was much bigger than a run.',
              name: 'Women’s Fitness Participant',
              role: 'Program Beneficiary'
            },
            {
              quote: 'LCF creates impact with heart. Their work reaches people with dignity, not just assistance.',
              name: 'Volunteer',
              role: 'On-ground Support Team'
            }
          ]
        }
      }
    ]
  });

  // ─────────────────────────────────────────
  // GET INVOLVED PAGE
  // ─────────────────────────────────────────
  await Page.create({
    page: 'get-involved',
    title: "Get Involved | Let's Celebrate Fitness",
    sections: [
      {
        type: 'page_hero',
        visible: true,
        order: 1,
        content: {
          heading: 'Get Involved',
          subtext: 'There are many ways to join the LCF movement.',
          image: ''
        }
      },
      {
        type: 'involvement_options',
        visible: true,
        order: 2,
        content: {
          options: [
            {
              icon: '🤝',
              title: 'Volunteer',
              description: 'Join our team of dedicated volunteers at events, food drives, and community programs.',
              cta: 'Become a Volunteer',
              href: '/contact'
            },
            {
              icon: '💛',
              title: 'Donate',
              description: 'Your contribution directly funds meals, education programs, and community events.',
              cta: 'Make a Donation',
              href: '/contact'
            },
            {
              icon: '🏃',
              title: 'Participate in Events',
              description: 'Join our marathons, fitness events, and community activities throughout the year.',
              cta: 'See Events',
              href: '/events'
            },
            {
              icon: '📢',
              title: 'Spread the Word',
              description: "Share our mission with your network. Awareness is the first step to change.",
              cta: 'Share Our Story',
              href: '/about'
            }
          ]
        }
      }
    ]
  });

  // ─────────────────────────────────────────
  // CONTACT PAGE
  // ─────────────────────────────────────────
  await Page.create({
    page: 'contact',
    title: "Contact Us | Let's Celebrate Fitness",
    sections: [
      {
        type: 'page_hero',
        visible: true,
        order: 1,
        content: {
          heading: 'Contact Us',
          subtext: "We'd love to hear from you.",
          image: ''
        }
      },
      {
        type: 'contact_info',
        visible: true,
        order: 2,
        content: {
          email: 'TODO: Add NGO email',
          phone: 'TODO: Add NGO phone',
          address: 'TODO: Add NGO address',
          socialLinks: {
            facebook: 'TODO: Add Facebook URL',
            instagram: 'TODO: Add Instagram URL'
          }
        }
      },
      {
        type: 'contact_flow',
        visible: true,
        order: 3,
        content: {
          heading: 'What Happens Next?',
          subtext: "Here's what to expect after you get in touch with us.",
          donationNote: 'Our team will guide you through the donation process after you get in touch.',
          responseNote: 'We typically respond within 24-48 hours.',
          volunteerSteps: [
            {
              title: 'Submit your interest',
              description: 'Share a few details about how you would like to support our work.'
            },
            {
              title: 'Our team reviews your details',
              description: 'We look at your message and identify the best fit based on your interests.'
            },
            {
              title: 'We contact you within 2-3 days',
              description: 'A team member reaches out with the next steps and answers your questions.'
            },
            {
              title: 'Attend a short orientation',
              description: 'You get a quick introduction to our mission, programs, and volunteering guidelines.'
            },
            {
              title: 'Start volunteering in programs',
              description: 'You begin contributing to the initiative that matches your availability and interest.'
            }
          ],
          donationSteps: [
            {
              title: 'Get in touch with us',
              description: 'Send us your donation interest through the contact form or other listed channels.'
            },
            {
              title: 'Our team connects with you',
              description: 'We reach out personally to understand your intent and preferred giving method.'
            },
            {
              title: 'We share donation details and options',
              description: 'You receive the available contribution modes and any required documentation details.'
            },
            {
              title: 'You complete the contribution',
              description: 'You finalize the donation using the method that works best for you.'
            },
            {
              title: 'Receive confirmation and 80G receipt (if applicable)',
              description: 'We confirm the contribution and share the acknowledgement and tax receipt when eligible.'
            }
          ]
        }
      }
    ]
  });

  // ─────────────────────────────────────────
  // EVENTS (Seeded)
  // ─────────────────────────────────────────
  await Page.create({
    page: 'events',
    title: "Events | Let's Celebrate Fitness",
    sections: [
      {
        type: 'page_hero',
        visible: true,
        order: 1,
        content: {
          heading: 'Our Events',
          subtext: 'Join us at our marathons, fitness events, and community activities.',
          image: ''
        }
      }
    ]
  });

  await Page.create({
    page: 'gallery',
    title: "Gallery | Let's Celebrate Fitness",
    sections: [
      {
        type: 'page_hero',
        visible: true,
        order: 1,
        content: {
          heading: 'Gallery',
          subtext: 'Moments from our events, drives, and community activities.',
          image: ''
        }
      }
    ]
  });

  await Event.create([
    {
      title: 'Swachh Navi Mumbai Marathon',
      description: 'A flagship marathon event promoting cleanliness and fitness in Navi Mumbai. One of the largest running events organized by LCF.',
      participants: 7500,
      status: 'past',
      category: 'Marathon',
      order: 1,
      visible: true
    },
    {
      title: "Women's Day Fitness Event",
      description: 'A special fitness event celebrating women and inspiring them to embrace an active lifestyle. Held on International Women\'s Day.',
      participants: 2500,
      status: 'past',
      category: 'Fitness',
      order: 2,
      visible: true
    },
    {
      title: 'Apollo Fitness Event',
      description: 'A community fitness event organized in partnership with Apollo, bringing together fitness enthusiasts for a day of health and wellness.',
      participants: 1800,
      status: 'past',
      category: 'Fitness',
      order: 3,
      visible: true
    },
    {
      title: 'Breast Cancer Awareness Event',
      description: 'A run/walk event raising awareness about breast cancer, encouraging early detection and healthy living among women.',
      participants: 2000,
      status: 'past',
      category: 'Awareness',
      order: 4,
      visible: true
    },
    {
      title: 'Transgender Fitness Event',
      description: 'An inclusive fitness event celebrating and empowering the transgender community through sport and movement.',
      participants: 800,
      status: 'past',
      category: 'Fitness',
      order: 5,
      visible: true
    }
  ]);

  console.log('✅ All seed data inserted');
  await mongoose.disconnect();
  console.log('Disconnected. Seeding complete!');
};

seedData().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
