export type Place = {
  id: string;
  name: string;
  category: string;
  hashtags: string[];
  phone: string;
  img: string;
  position: [number, number];
};

export const PLACES: Place[] = [
  {
    id: "cafe-1",
    name: "Made for Mouth Cafe",
    category: "Cafe",
    hashtags: ["#คาเฟ่พิษณุโลก", "#ร้านดัง", "#minimalist"],
    phone: "055-123-456",
    img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800",
    position: [16.8210, 100.2550],
  },
  {
    id: "restaurant-1",
    name: "Pae the River",
    category: "Restaurant",
    hashtags: ["#ริมน้ำน่าน", "#อาหารไทย", "#วิวสวย"],
    phone: "055-301-789",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800",
    position: [16.8150, 100.2670],
  },
  {
    id: "park-1",
    name: "สวนสมเด็จพระนเรศวร",
    category: "Park",
    hashtags: ["#สวนสาธารณะ", "#พักผ่อน", "#ออกกำลังกาย"],
    phone: "055-244-100",
    img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800",
    position: [16.8300, 100.2620],
  },
  {
    id: "bar-1",
    name: "Riverside Bar & Lounge",
    category: "Bar",
    hashtags: ["#barพิษณุโลก", "#ริมน้ำ", "#nightlife"],
    phone: "092-456-7890",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800",
    position: [16.8185, 100.2635],
  },
  {
    id: "workshop-1",
    name: "Phitsanulok Craft Workshop",
    category: "Workshop",
    hashtags: ["#handmade", "#งานฝีมือ", "#DIY"],
    phone: "081-234-5678",
    img: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=800",
    position: [16.8170, 100.2590],
  },
  {
    id: "museum-1",
    name: "พิพิธภัณฑ์พื้นบ้านจ่าทวี",
    category: "Museum",
    hashtags: ["#museum", "#ประวัติศาสตร์", "#วัฒนธรรม"],
    phone: "055-258-858",
    img: "https://images.unsplash.com/photo-1563294336-16d7a4cb88dd?q=80&w=800",
    position: [16.8120, 100.2740],
  },
  {
    id: "localshop-1",
    name: "ตลาดริมน้ำน่าน",
    category: "Local shop",
    hashtags: ["#ตลาดพิษณุโลก", "#ของฝาก", "#streetfood"],
    phone: "086-789-0123",
    img: "https://www.phitsanulokhotnews.com/wp-content/media/2023/06/IMG_6676-3_1575x1050.jpg",
    position: [16.8200, 100.2640],
  },
  {
    id: "temple-001",
    name: "วัดพระศรีรัตนมหาธาตุวรมหาวิหาร",
    category: "Temple",
    hashtags: ["#วัดพิษณุโลก", "#พระพุทธชินราช", "#unseen"],
    phone: "055258966",
    img: "https://image-tc.galaxy.tf/wijpeg-3fvrgksxjmddlgex2zime0tve/temple-of-wat-phra-si-rattana-mahathat-hop-inn-hotel_standard.jpg?crop=0%2C0%2C555%2C416",
    position: [16.823680921126684, 100.26191685462676],
  },
  {
    id: "temple-002",
    name: "วัดนางพญา",
    category: "Temple",
    hashtags: ["#วัดพิษณุโลก", "#unseen"],
    phone: "No contact number",
    img: "https://www.bloggang.com/data/a/aumteerama/picture/1669400885.jpg",
    position: [16.822688075959178, 100.2619532168755],
  },
  {
    id: "temple-003",
    name: "วัดจันทร์ตะวันตก",
    category: "Temple",
    hashtags: ["#วัดพิษณุโลก", "#unseen"],
    phone: "055251729",
    img: "https://ik.imagekit.io/tvlk/blog/2024/11/background-religious-attractions-phitsanulok-province-wat-1024x683.jpg?tr=q-70,c-at_max,w-1000,h-600",
    position: [16.807252424523515, 100.24638104171648],
  },
  {
    id: "temple-004",
    name: "วัดจันทร์ตะวันออก",
    category: "Temple",
    hashtags: ["#วัดพิษณุโลก", "#unseen"],
    phone: "06101483",
    img: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Wat_Chan_Tawan-ok_%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%B0%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%AD%E0%B8%AD%E0%B8%81_-_img_01.jpg",
    position: [16.8046704601266, 100.2450000975198],
  },
];
