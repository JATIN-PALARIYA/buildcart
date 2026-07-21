import { connectDB } from "@/lib/db";
import { hashPassword } from "@/lib/hash";
import { generateSlug } from "@/utils/slug";
import { imagekit } from "@/lib/imagekit";
import adminModel from "@/models/Admin";
import categoryModel from "@/models/Category";
import productModel from "@/models/Product";
import orderModel from "@/models/Order";
import { NextResponse } from "next/server";

// Comprehensive image base pool for 15 categories (using clean, high-quality direct Unsplash links)
const baseImages = {
    "windows-laptops": [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"
    ],
    "macbooks-macs": [
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800",
        "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800"
    ],
    "iphones": [
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800",
        "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800"
    ],
    "android-phones": [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"
    ],
    "tablets-ipads": [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
        "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800"
    ],
    "ram-memory": [
        "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800",
        "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800"
    ],
    "ssds-storage": [
        "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800",
        "https://images.unsplash.com/photo-1562975078-0a69f082e667?w=800"
    ],
    "hdds-storage": [
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800"
    ],
    "graphics-cards": [
        "https://images.unsplash.com/photo-1601524909162-be87252be298?w=800",
        "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800"
    ],
    "processors-cpus": [
        "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"
    ],
    "monitors": [
        "https://images.unsplash.com/photo-1616440347931-e12911b3749a?w=800",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800"
    ],
    "keyboards-input": [
        "https://images.unsplash.com/photo-1585338111119-410a747942a6?w=800",
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800"
    ],
    "audio-speakers": [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=800"
    ],
    "cables-adapters": [
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800",
        "https://images.unsplash.com/photo-1562975078-0a69f082e667?w=800"
    ],
    "networking-routers": [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
        "https://images.unsplash.com/photo-1585338111119-410a747942a6?w=800"
    ]
};

export async function POST() {
    try {
        await connectDB();

        // 1. Reset existing collections for clean seed
        await adminModel.deleteMany({});
        await categoryModel.deleteMany({});
        await productModel.deleteMany({});
        await orderModel.deleteMany({});

        // 2. Create Admin
        const hashedPassword = await hashPassword("admin");
        const admin = await adminModel.create({
            name: "Demo Admin",
            email: "admin@admin.com",
            password: hashedPassword,
            role: "admin",
        });

        // 3. Create Categories (15 distinct tech categories)
        const categoriesData = [
            { name: "Windows Laptops", slug: "windows-laptops", description: "Thin & light, professional, and gaming Windows laptops" },
            { name: "MacBooks & Macs", slug: "macbooks-macs", description: "Apple Silicon MacBooks, iMacs, and Mac Mini computers" },
            { name: "iPhones & iOS", slug: "iphones", description: "Latest Apple iPhone devices and iOS accessories" },
            { name: "Android Phones", slug: "android-phones", description: "Premium flagship and budget Android smartphones" },
            { name: "Tablets & iPads", slug: "tablets-ipads", description: "iPads, Android tablets, and drawing graphics tablets" },
            { name: "RAM (Memory)", slug: "ram-memory", description: "DDR4 and DDR5 RAM kits for laptops and desktops" },
            { name: "SSDs (Solid State)", slug: "ssds-storage", description: "High-speed NVMe M.2 and SATA solid state drives" },
            { name: "HDDs (Hard Drives)", slug: "hdds-storage", description: "High-capacity internal and external mechanical hard drives" },
            { name: "Graphics Cards (GPUs)", slug: "graphics-cards", description: "NVIDIA GeForce and AMD Radeon graphics cards" },
            { name: "Processors (CPUs)", slug: "processors-cpus", description: "Intel Core and AMD Ryzen desktop processors" },
            { name: "Monitors & Screens", slug: "monitors", description: "4K, curved, gaming, and color-accurate desktop monitors" },
            { name: "Keyboards & Input", slug: "keyboards-input", description: "Mechanical keyboards, ergonomic mice, and trackpads" },
            { name: "Audio & Speakers", slug: "audio-speakers", description: "Studio monitors, headphones, and USB microphones" },
            { name: "Cables & Adapters", slug: "cables-adapters", description: "HDMI, DisplayPort, USB-C cables, and multi-port hub adapters" },
            { name: "Networking & Routers", slug: "networking-routers", description: "Wi-Fi 6 routers, mesh systems, and ethernet switches" }
        ];
        const categories = await categoryModel.insertMany(categoriesData);

        // Map category slugs/names to ObjectIds
        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.slug] = cat._id;
            return acc;
        }, {} as Record<string, any>);

        // Initialize ImageKit mapping
        const imagekitMapping: Record<string, Array<{ url: string; fileId: string }>> = {};
        const categoriesList = Object.keys(baseImages);
        for (const cat of categoriesList) {
            imagekitMapping[cat] = [];
        }

        // 4. Upload Base Images to ImageKit in parallel for extreme speed
        const uploadPromises = categoriesList.map(async (cat) => {
            const urls = baseImages[cat as keyof typeof baseImages];
            for (let idx = 0; idx < urls.length; idx++) {
                try {
                    const uploadResult = await imagekit.files.upload({
                        file: urls[idx],
                        fileName: `seed_${cat}_${idx}.jpg`,
                        folder: "buildcart/seed_products/",
                    });
                    if (uploadResult.url && uploadResult.fileId) {
                        imagekitMapping[cat].push({
                            url: uploadResult.url,
                            fileId: uploadResult.fileId
                        });
                    }
                } catch (uploadError) {
                    console.error(`ImageKit upload failed for category ${cat}:`, uploadError);
                }
            }
        });
        await Promise.all(uploadPromises);

        // Helper to retrieve category images with ImageKit or Unsplash fallbacks
        const getImagesForCategory = (cat: string, index: number) => {
            const uploaded = imagekitMapping[cat];
            if (uploaded && uploaded.length >= 2) {
                const img1 = uploaded[index % uploaded.length];
                const img2 = uploaded[(index + 1) % uploaded.length];
                return {
                    images: [img1.url, img2.url],
                    imageFileId: img1.fileId
                };
            }
            
            // Fallback to Unsplash
            const fallbackPool = baseImages[cat as keyof typeof baseImages];
            return {
                images: [
                    fallbackPool[index % fallbackPool.length],
                    fallbackPool[(index + 1) % fallbackPool.length]
                ],
                imageFileId: ""
            };
        };

        // 5. Generate 105 Products (7 products per category across 15 categories)
        const productsData: any[] = [];
        
        const categoryGenerators: Record<string, { adjs: string[], nouns: string[], features: string[] }> = {
            "windows-laptops": {
                adjs: ["Asus ROG", "Lenovo ThinkPad", "Dell XPS", "HP Spectre", "Acer Predator", "Razer Blade", "Samsung Galaxy Book"],
                nouns: ["Gaming Laptop", "Business Notebook", "Ultra-Thin Laptop", "Creator Laptop", "2-in-1 Touchscreen", "Mobile Workstation", "Portable Laptop"],
                features: ["with 16GB RAM and RTX 4060 graphics.", "featuring a 165Hz IPS display and Intel i7 CPU.", "with an all-day 12-hour battery life and metal body.", "equipped with a liquid metal cooling system.", "supporting stylus pen and active touch gestures.", "with high-speed Wi-Fi 6E connectivity."]
            },
            "macbooks-macs": {
                adjs: ["MacBook Pro 14\"", "MacBook Air 13\"", "MacBook Pro 16\"", "Mac Mini", "iMac 24\"", "Mac Studio", "MacBook Air 15\""],
                nouns: ["Apple M3 Chip", "Apple M3 Pro Chip", "Apple M3 Max Chip", "Apple M2 Chip", "Liquid Retina Display", "Thunderbolt 4 Workstation", "SuperCharged Notebook"],
                features: ["featuring 8-core CPU and 10-core GPU.", "with 16GB unified memory and 512GB SSD.", "offering up to 22 hours of silent battery life.", "built with an ultra-quiet fan thermal system.", "with gorgeous studio-quality microphone arrays.", "supporting dual external high-resolution monitors."]
            },
            "iphones": {
                adjs: ["iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "iPhone 13 mini", "iPhone SE", "iPhone 15 Plus", "iPhone 15 Pro Max"],
                nouns: ["Super Retina XDR", "Titanium Smartphone", "A17 Pro Flagship", "A16 Bionic Smartphone", "Compact iOS Phone", "Dynamic Island Mobile", "Cinematic Cam Phone"],
                features: ["with 48MP main camera and 5x optical zoom.", "featuring a durable color-infused glass design.", "equipped with custom USB-C charging speeds.", "offering Roadside Assistance via satellite connection.", "with Action button to customize shortcuts.", "featuring Ceramic Shield front protection."]
            },
            "android-phones": {
                adjs: ["Samsung Galaxy S24", "Google Pixel 8", "OnePlus 12", "Xiaomi 14", "Motorola Edge", "Samsung Galaxy Z Fold", "Nothing Phone (2)"],
                nouns: ["Ultra Flagship", "AI Smartphone", "Pro Android Mobile", "Folding Phone", "Sleek Android Phone", "Fluid AMOLED Mobile", "Glyph Interface Phone"],
                features: ["featuring real-time live translation AI.", "with a 50MP triple camera and night sight.", "supporting 100W super-fast wired charging.", "equipped with a custom vapor chamber cooler.", "featuring a 120Hz LTPO display screen.", "with clean near-stock software experience."]
            },
            "tablets-ipads": {
                adjs: ["iPad Pro 11\"", "iPad Air", "Samsung Galaxy Tab", "Wacom Intuos", "iPad mini", "Lenovo Tab Extreme", "XP-Pen Artist"],
                nouns: ["Liquid Retina Tablet", "Android Entertainment Slate", "Professional Drawing Tablet", "Compact iPad", "OLED Slate Tablet", "Creative Pen Display", "Multi-Touch Tablet"],
                features: ["supporting Apple Pencil Hover technology.", "with a gorgeous 120Hz AMOLED screen panel.", "equipped with 8192 levels of pen pressure sensitivity.", "featuring quad-speakers with Dolby Atmos sound.", "with thin bezel aluminum frame design.", "supporting magnetic charging pen dock."]
            },
            "ram-memory": {
                adjs: ["Corsair Vengeance", "G.Skill Trident Z5", "Kingston FURY", "Crucial Pro", "Teamgroup T-Force", "Patriot Viper", "ADATA XPG"],
                nouns: ["DDR5 Desktop RAM Kit", "DDR4 Laptop SODIMM", "RGB Memory Module", "Dual-Channel RAM Pack", "Low-Profile DDR5 RAM", "Overclocked Gaming Memory", "High-Density SODIMM"],
                features: ["supporting Intel XMP 3.0 profile settings.", "equipped with sleek aluminum heat spreaders.", "featuring custom programmable RGB lightbar strips.", "optimized for AMD EXPO overclocking profiles.", "running at ultra-low latency latency speeds.", "offering lifetime limited backup warranty."]
            },
            "ssds-storage": {
                adjs: ["Samsung 990 PRO", "WD Black SN850X", "Crucial T700", "Sabrent Rocket", "Kingston KC3000", "SanDisk Extreme", "Samsung T7 Shield"],
                nouns: ["PCIe Gen 5 NVMe SSD", "PCIe Gen 4 NVMe M.2", "External Portable SSD", "High-Endurance M.2 SSD", "Rugged USB-C SSD", "Heatsink NVMe Drive", "Internal M.2 SSD"],
                features: ["delivering blazing-fast 14,000 MB/s read speeds.", "equipped with a custom aluminum heatsink cooler.", "featuring IP65 water and dust drop protection.", "powered by latest V-NAND TLC memory flash.", "optimized for PlayStation 5 storage expansion.", "supporting hardware-based AES 256-bit encryption."]
            },
            "hdds-storage": {
                adjs: ["Seagate BarraCuda", "WD Blue", "Toshiba Canvio", "Seagate IronWolf", "WD Red Pro", "LaCie Rugged", "Seagate Expansion"],
                nouns: ["3.5\" Desktop Hard Drive", "2.5\" Portable External HDD", "NAS SATA Hard Drive", "Heavy-Duty External Drive", "Internal SATA 6Gb/s HDD", "USB 3.0 External Disk", "Desktop RAID Backup"],
                features: ["with massive 8TB storage capacity.", "equipped with shock-resistant bumper casing.", "optimized for 24/7 continuous NAS workloads.", "featuring multi-tier caching technology (MTC).", "with simple plug-and-play USB 3.0 setup.", "running at 7200 RPM high spindle speed."]
            },
            "graphics-cards": {
                adjs: ["ASUS ROG Strix", "MSI Gaming X Trio", "Gigabyte AORUS", "EVGA Ultra Gaming", "Zotac Trinity", "Sapphire NITRO+", "PowerColor Red Devil"],
                nouns: ["GeForce RTX 4090", "Radeon RX 7900 XTX", "GeForce RTX 4070 Ti", "Radeon RX 7800 XT", "GeForce RTX 4060 Ti", "RTX 4080 Super GPU", "Liquid-Cooled GPU"],
                features: ["featuring 24GB GDDR6X dedicated video memory.", "equipped with a triple axial-tech fan design.", "supporting real-time ray tracing and DLSS 3.", "equipped with a dual BIOS performance switch.", "featuring a customizable ARGB lighting shroud.", "with a solid metal protective backplate."]
            },
            "processors-cpus": {
                adjs: ["Intel Core i9-14900K", "AMD Ryzen 7 7800X3D", "Intel Core i7-14700K", "AMD Ryzen 9 7950X", "Intel Core i5-14600K", "AMD Ryzen 5 7600X", "AMD Ryzen 9 7900X3D"],
                nouns: ["24-Core Desktop CPU", "8-Core Gaming CPU", "20-Core Processor", "16-Core Powerhouse CPU", "14-Core Unlocked CPU", "6-Core Budget CPU", "12-Core 3D V-Cache CPU"],
                features: ["equipped with 3D V-Cache tech for gaming.", "supporting PCIe 5.0 and dual-channel DDR5.", "with maximum boost clock speeds up to 6.0 GHz.", "built on advanced TSMC 5nm lithography process.", "featuring unlocked multiplier for easy overclocking.", "including basic integrated UHD graphics block."]
            },
            "monitors": {
                adjs: ["Dell UltraSharp 32\"", "ASUS ROG Swift", "LG UltraGear 27\"", "Samsung Odyssey G9", "BenQ PD3200U", "Gigabyte M27Q", "MSI Optix Curved"],
                nouns: ["4K IPS Professional Monitor", "240Hz Gaming Display Screen", "49-Inch Curved OLED Monitor", "Color-Accurate Designer Screen", "QHD 170Hz Gaming Monitor", "Curved UltraWide Monitor", "USB-C Hub Office Screen"],
                features: ["delivering 100% sRGB color calibration.", "featuring 0.03ms response time and G-Sync.", "offering built-in KVM switch connectivity.", "supporting VESA DisplayHDR 1000 standards.", "featuring a steep 1000R curvature wrap.", "equipped with an adjustable height ergonomic stand."]
            },
            "keyboards-input": {
                adjs: ["Keychron Q1", "Logitech MX Master 3S", "Razer Huntsman V3", "SteelSeries Apex Pro", "Apple Magic", "NuPhy Air75", "Glorious GMMK Pro"],
                nouns: ["Mechanical Gasket Keyboard", "Ergonomic Office Mouse", "Analog Optical Keyboard", "Ultra-Slim Wireless Keyboard", "Hot-Swappable Custom Keyboard", "High-Precision Gaming Mouse", "Gasket-Mounted Barebone"],
                features: ["with double-shot PBT keycaps and switches.", "featuring quiet-click switches and magspeed scroll wheel.", "equipped with adjustable actuation optical switches.", "supporting multi-pairing up to 3 devices.", "housed in a solid CNC machined aluminum frame.", "featuring customizable RGB per-key backlighting."]
            },
            "audio-speakers": {
                adjs: ["Audioengine A2+", "Sony WH-1000XM5", "Shure SM7B", "JBL Professional", "Sennheiser HD 600", "Focusrite Scarlett", "Rode PodMic"],
                nouns: ["Wireless ANC Headphones", "USB Studio Microphone", "Acoustic Desktop Speakers", "Audiophile Open-Back Headset", "USB Audio Interface Kit", "Dynamic Podcast Microphone", "Active Reference Monitors"],
                features: ["delivering audiophile-grade high-fidelity sound.", "featuring industry-leading active noise cancellation.", "equipped with dual built-in class AB power amplifiers.", "delivering warm, clear vocal broadcast audio.", "featuring high-resolution 24-bit/192kHz converters.", "built with durable steel body shielding casing."]
            },
            "cables-adapters": {
                adjs: ["Anker PowerLine", "Cable Matters", "Belkin BoostCharge", "Ugreen Nexode", "Satechi Aluminum", "StarTech", "Anker 8-in-1"],
                nouns: ["Nylon Braided USB-C Cable", "HDMI 2.1 8K Cable", "Thunderbolt 4 Active Cable", "USB-C Multi-Port Hub Adapter", "Dual HDMI Docking Station", "DisplayPort 1.4 Cable", "100W GaN Wall Charger Fast"],
                features: ["supporting 100W Power Delivery (PD) charging.", "delivering high speed 40Gbps data transfer.", "supporting 8K resolution video at 60Hz.", "offering space-saving travel-friendly fold design.", "featuring triple shielding wire to prevent interference.", "encased in premium heat-resistant aluminum shells."]
            },
            "networking-routers": {
                adjs: ["ASUS ROG Rapture", "Netgear Nighthawk", "TP-Link Deco", "Ubiquiti UniFi", "Linksys Velop", "Eero Pro 6E", "TP-Link Archer"],
                nouns: ["Wi-Fi 6E Gaming Router", "Tri-Band Mesh System Pack", "Enterprise Access Point", "Gigabit Ethernet Switch Board", "Dual-Band Wi-Fi 6 Router", "Smart Home Mesh Router", "Multi-Gigabit Wired Gateway"],
                features: ["covering up to 5000 square feet with mesh.", "supporting high-speed 10Gbps WAN internet inputs.", "optimized for lag-free gaming and 8K streams.", "equipped with advanced WPA3 security protocols.", "supporting over 150 connected IoT devices.", "featuring simplified smart app-guided installation."]
            }
        };

        for (const cat of categoriesList) {
            const gen = categoryGenerators[cat];
            for (let i = 0; i < 7; i++) {
                const adj = gen.adjs[i % gen.adjs.length];
                const noun = gen.nouns[(i + 2) % gen.nouns.length];
                const feature = gen.features[i % gen.features.length];

                const name = `${adj} ${noun}`;
                const slug = generateSlug(`${name}-${cat}-${i + 1}`);
                const description = `The high-performance ${name} is ${feature} Carefully sourced and refined, it represents the pinnacle of technology for modern developer workstations and home setups.`;
                
                let basePrice = 49.99;
                if (cat.includes("laptops") || cat.includes("macs")) basePrice = 699.99 + (i * 125);
                else if (cat.includes("phones") || cat.includes("tab")) basePrice = 299.99 + (i * 80);
                else if (cat.includes("graphics") || cat.includes("processor") || cat.includes("monitor")) basePrice = 199.99 + (i * 90);
                else if (cat.includes("ram") || cat.includes("ssd") || cat.includes("hdd") || cat.includes("audio")) basePrice = 59.99 + (i * 25);
                else basePrice = 15.99 + (i * 10);
                
                const price = Math.round(basePrice * 100) / 100;
                const stock = 10 + (i * 3) % 45;
                const imgData = getImagesForCategory(cat, i);

                productsData.push({
                    name,
                    slug,
                    description,
                    price,
                    stock,
                    category: categoryMap[cat],
                    images: imgData.images,
                    imageFileId: imgData.imageFileId,
                    isActive: true
                });
            }
        }

        const products = await productModel.insertMany(productsData);

        // 6. Calculate historic dates and create orders
        const now = new Date();
        const getRelativeDate = (daysAgo: number, monthsAgo: number = 0) => {
            const d = new Date(now);
            d.setDate(now.getDate() - daysAgo);
            d.setMonth(now.getMonth() - monthsAgo);
            return d;
        };

        const ordersData = [
            {
                customerName: "John Doe",
                customerEmail: "john@example.com",
                customerPhone: "+15551234567",
                shippingAddress: "123 Main Street, New York, NY 10001",
                products: [
                    { productId: products[0]._id, quantity: 1, price: products[0].price },
                    { productId: products[10]._id, quantity: 2, price: products[10].price }
                ],
                totalAmount: Math.round((products[0].price + (products[10].price * 2)) * 100) / 100,
                status: "pending",
                createdAt: getRelativeDate(0)
            },
            {
                customerName: "Jane Smith",
                customerEmail: "jane@example.com",
                customerPhone: "+15559876543",
                shippingAddress: "456 Oak Avenue, Los Angeles, CA 90001",
                products: [
                    { productId: products[45]._id, quantity: 1, price: products[45].price }
                ],
                totalAmount: products[45].price,
                status: "processing",
                createdAt: getRelativeDate(0)
            },
            {
                customerName: "Bob Johnson",
                customerEmail: "bob@example.com",
                customerPhone: "+15554567890",
                shippingAddress: "789 Pine Road, Chicago, IL 60601",
                products: [
                    { productId: products[25]._id, quantity: 1, price: products[25].price }
                ],
                totalAmount: products[25].price,
                status: "completed",
                createdAt: getRelativeDate(1)
            },
            {
                customerName: "Alice Brown",
                customerEmail: "alice@example.com",
                customerPhone: "+15552345678",
                shippingAddress: "321 Elm Lane, Houston, TX 77001",
                products: [
                    { productId: products[12]._id, quantity: 1, price: products[12].price }
                ],
                totalAmount: products[12].price,
                status: "completed",
                createdAt: getRelativeDate(2)
            },
            {
                customerName: "Charlie Green",
                customerEmail: "charlie@example.com",
                customerPhone: "+15558765432",
                shippingAddress: "654 Birch Court, Seattle, WA 98101",
                products: [
                    { productId: products[62]._id, quantity: 1, price: products[62].price }
                ],
                totalAmount: products[62].price,
                status: "completed",
                createdAt: getRelativeDate(3)
            },
            {
                customerName: "David White",
                customerEmail: "david@example.com",
                customerPhone: "+15553456789",
                shippingAddress: "987 Maple Boulevard, Miami, FL 33101",
                products: [
                    { productId: products[80]._id, quantity: 1, price: products[80].price }
                ],
                totalAmount: products[80].price,
                status: "processing",
                createdAt: getRelativeDate(4)
            },
            {
                customerName: "Emma Black",
                customerEmail: "emma@example.com",
                customerPhone: "+15557654321",
                shippingAddress: "159 Cedar Drive, Denver, CO 80201",
                products: [
                    { productId: products[75]._id, quantity: 1, price: products[75].price }
                ],
                totalAmount: products[75].price,
                status: "completed",
                createdAt: getRelativeDate(5)
            },
            {
                customerName: "Frank Gray",
                customerEmail: "frank@example.com",
                customerPhone: "+15559012345",
                shippingAddress: "753 Redwood Ave, San Francisco, CA 94101",
                products: [
                    { productId: products[30]._id, quantity: 1, price: products[30].price }
                ],
                totalAmount: products[30].price,
                status: "completed",
                createdAt: getRelativeDate(6)
            },
            {
                customerName: "Diana Prince",
                customerEmail: "diana@themyscira.com",
                customerPhone: "+15551941",
                shippingAddress: "Gateway City Museum, Gateway City, CA 94011",
                products: [
                    { productId: products[15]._id, quantity: 1, price: products[15].price },
                    { productId: products[40]._id, quantity: 1, price: products[40].price }
                ],
                totalAmount: Math.round((products[15].price + products[40].price) * 100) / 100,
                status: "completed",
                createdAt: getRelativeDate(8)
            },
            {
                customerName: "Barry Allen",
                customerEmail: "barry@ccpd.gov",
                customerPhone: "+15551956",
                shippingAddress: "Central City Forensic Lab, Central City, MO 64012",
                products: [
                    { productId: products[60]._id, quantity: 2, price: products[60].price }
                ],
                totalAmount: Math.round((products[60].price * 2) * 100) / 100,
                status: "completed",
                createdAt: getRelativeDate(12)
            },
            {
                customerName: "Sarah Connor",
                customerEmail: "sarah@example.com",
                customerPhone: "+15559998888",
                shippingAddress: "100 Resistance Way, Los Angeles, CA 90002",
                products: [
                    { productId: products[5]._id, quantity: 3, price: products[5].price },
                    { productId: products[28]._id, quantity: 2, price: products[28].price }
                ],
                totalAmount: Math.round(((products[5].price * 3) + (products[28].price * 2)) * 100) / 100,
                status: "completed",
                createdAt: getRelativeDate(10, 1)
            },
            {
                customerName: "John Connor",
                customerEmail: "jc@example.com",
                customerPhone: "+15558887777",
                shippingAddress: "100 Resistance Way, Los Angeles, CA 90002",
                products: [
                    { productId: products[15]._id, quantity: 1, price: products[15].price }
                ],
                totalAmount: products[15].price,
                status: "completed",
                createdAt: getRelativeDate(20, 1)
            },
            {
                customerName: "Tony Stark",
                customerEmail: "tony@stark.com",
                customerPhone: "+15553000",
                shippingAddress: "10880 Malibu Point, Malibu, CA 90265",
                products: [
                    { productId: products[8]._id, quantity: 2, price: products[8].price },
                    { productId: products[90]._id, quantity: 1, price: products[90].price }
                ],
                totalAmount: Math.round(((products[8].price * 2) + products[90].price) * 100) / 100,
                status: "completed",
                createdAt: getRelativeDate(15, 2)
            },
            {
                customerName: "Bruce Wayne",
                customerEmail: "bruce@wayne.com",
                customerPhone: "+15551939",
                shippingAddress: "1007 Mountain Drive, Gotham City, NJ 07001",
                products: [
                    { productId: products[18]._id, quantity: 3, price: products[18].price },
                    { productId: products[85]._id, quantity: 1, price: products[85].price }
                ],
                totalAmount: Math.round(((products[18].price * 3) + products[85].price) * 100) / 100,
                status: "completed",
                createdAt: getRelativeDate(5, 3)
            },
            {
                customerName: "Clark Kent",
                customerEmail: "clark@dailyplanet.com",
                customerPhone: "+15551938",
                shippingAddress: "344 Clinton Street, Metropolis, NY 10002",
                products: [
                    { productId: products[55]._id, quantity: 1, price: products[55].price }
                ],
                totalAmount: products[55].price,
                status: "completed",
                createdAt: getRelativeDate(25, 3)
            },
            {
                customerName: "Peter Parker",
                customerEmail: "peter@dailybugle.com",
                customerPhone: "+15551962",
                shippingAddress: "20 Ingram Street, Forest Hills, NY 11375",
                products: [
                    { productId: products[35]._id, quantity: 3, price: products[35].price },
                    { productId: products[29]._id, quantity: 2, price: products[29].price }
                ],
                totalAmount: Math.round(((products[35].price * 3) + (products[29].price * 2)) * 100) / 100,
                status: "completed",
                createdAt: getRelativeDate(12, 4)
            },
            {
                customerName: "Bruce Banner",
                customerEmail: "bruce@green.com",
                customerPhone: "+15551963",
                shippingAddress: "Scientist Hideout, Desert Basin, NM 87001",
                products: [
                    { productId: products[2]._id, quantity: 3, price: products[2].price },
                    { productId: products[50]._id, quantity: 2, price: products[50].price }
                ],
                totalAmount: Math.round(((products[2].price * 3) + (products[50].price * 2)) * 100) / 100,
                status: "completed",
                createdAt: getRelativeDate(18, 5)
            }
        ];
        await orderModel.insertMany(ordersData);

        return NextResponse.json({
            success: true,
            message: "15 computer shop categories and 105 products seeded successfully!",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error("Seeding error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "An error occurred during database seeding."
        }, { status: 500 });
    }
}
