export type Activity = {
  id: string;
  name: string;
  category: string;
  hashtags: string[];
  explanation: string;
  img: string;
  planPng?: string;
  // Detail page fields
  address?: string;
  hours?: string;
  phone?: string;
  website?: string;
  about?: string;
  amenities?: string[];
  gallery?: string[];
};

export const ACTIVITIES: Activity[] = [
  {
    id: "cafe-trip-holiday",
    name: "Cafe trip on Holiday",
    category: "Cafe",
    hashtags: ["#sweetvibes", "#คาเฟ่พิษณุโลก", "#morningcoffee"],
    explanation: "เริ่มวันหยุดด้วยการสำรวจคาเฟ่สวยๆ รอบเมือง บรรยากาศดี กาแฟหอม เหมาะกับการนั่งพักผ่อนหรือทำงาน",
    img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800",
    planPng: "Cafe_Plan_1.png",
    address: "ถนนพุทธบูชา ตำบลในเมือง อำเภอเมืองพิษณุโลก",
    hours: "08:00 AM – 06:00 PM (Daily)",
    phone: "+66 55 123 456",
    website: "https://example.com/cafe-phitsanulok",
    about: "เส้นทางคาเฟ่ที่คัดสรรมาอย่างดีในเมืองพิษณุโลก ไม่ว่าจะเป็นคาเฟ่สไตล์มินิมอลริมแม่น้ำน่าน คาเฟ่ซ่อนในซอยเงียบ หรือร้านกาแฟโบราณที่ยังคงกลิ่นอายดั้งเดิม แต่ละร้านมีเอกลักษณ์เฉพาะตัว เหมาะสำหรับการนั่งพักผ่อน ถ่ายรูป หรือนั่งทำงาน บรรยากาศผ่อนคลาย เมนูเครื่องดื่มหลากหลาย ทั้งกาแฟสด ชา และเบเกอรี่สดใหม่",
    amenities: [
      "Free WiFi",
      "Air Conditioned",
      "Pet Friendly",
      "Takeaway Available",
      "Parking Available",
      "Wheelchair Accessible",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800",
    ],
  },
  {
    id: "temple-morning-visit",
    name: "Morning Temple Trail",
    category: "Temple",
    hashtags: ["#วัดพิษณุโลก", "#พระพุทธชินราช", "#สักการะ"],
    explanation: "เริ่มเช้าด้วยการไหว้พระขอพรที่วัดพระศรีรัตนมหาธาตุ สัมผัสความศักดิ์สิทธิ์และความงามทางสถาปัตยกรรมไทย",
    img: "https://images.unsplash.com/photo-1540610996881-1bc54ee5512b?q=80&w=800",
    address: "ถนนพุทธบูชา ตำบลในเมือง อำเภอเมืองพิษณุโลก",
    hours: "06:00 AM – 06:00 PM (Daily)",
    phone: "+66 55 258 013",
  },
  {
    id: "river-dinner",
    name: "River Dinner Experience",
    category: "Restaurant",
    hashtags: ["#ริมน้ำน่าน", "#อาหารไทย", "#วิวพระอาทิตย์ตก"],
    explanation: "รับประทานอาหารค่ำริมแม่น้ำน่าน ชมวิวพระอาทิตย์ตกดิน เมนูอาหารไทยแท้รสชาติดั้งเดิม",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800",
    address: "ริมแม่น้ำน่าน ตำบลในเมือง พิษณุโลก",
    hours: "11:00 AM – 10:00 PM (Daily)",
    phone: "+66 55 301 789",
  },
  {
    id: "sunset-park-walk",
    name: "Sunset Park Walk",
    category: "Park",
    hashtags: ["#สวนสาธารณะ", "#ยามเย็น", "#ธรรมชาติ"],
    explanation: "เดินเล่นชมวิวในสวนสมเด็จพระนเรศวร ยามพระอาทิตย์ตก บรรยากาศร่มรื่น เหมาะกับการผ่อนคลาย",
    img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800",
    address: "สวนสมเด็จพระนเรศวร ถนนสิงหวัฒน์ พิษณุโลก",
    hours: "05:00 AM – 09:00 PM (Daily)",
    phone: "+66 55 244 100",
  },
  {
    id: "evening-bar-hop",
    name: "Evening Bar Hopping",
    category: "Bar",
    hashtags: ["#nightlife", "#barพิษณุโลก", "#ริมน้ำ"],
    explanation: "สำรวจบาร์ริมแม่น้ำน่านยามค่ำคืน ดื่มด่ำบรรยากาศสุดชิลล์ พร้อมดนตรีสดและวิวแม่น้ำ",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800",
    address: "ย่านริมน้ำน่าน ตำบลในเมือง พิษณุโลก",
    hours: "06:00 PM – 12:00 AM (Daily)",
    phone: "+66 92 456 7890",
  },
  {
    id: "craft-workshop-day",
    name: "Local Craft Workshop Day",
    category: "Workshop",
    hashtags: ["#handmade", "#งานฝีมือ", "#DIYพิษณุโลก"],
    explanation: "เรียนรู้งานหัตถกรรมพื้นบ้านพิษณุโลก ทำของที่ระลึกด้วยมือตัวเอง นำกลับบ้านได้เลย",
    img: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=800",
    address: "ถนนวิสุทธิกษัตริย์ ตำบลในเมือง พิษณุโลก",
    hours: "09:00 AM – 05:00 PM (Mon–Sat)",
    phone: "+66 81 234 5678",
  },
  {
    id: "heritage-museum-tour",
    name: "Heritage Museum Tour",
    category: "Museum",
    hashtags: ["#ประวัติศาสตร์", "#วัฒนธรรม", "#จ่าทวี"],
    explanation: "ทัวร์พิพิธภัณฑ์พื้นบ้านจ่าทวี เรียนรู้ประวัติศาสตร์และวิถีชีวิตของคนพิษณุโลกในอดีต",
    img: "https://images.unsplash.com/photo-1563294336-16d7a4cb88dd?q=80&w=800",
    address: "26/43 ถนนวิสุทธิกษัตริย์ ตำบลในเมือง พิษณุโลก",
    hours: "08:30 AM – 04:30 PM (Wed–Sun)",
    phone: "+66 55 258 858",
  },
  {
    id: "night-bazaar-shopping",
    name: "Night Bazaar Shopping",
    category: "Local shop",
    hashtags: ["#ตลาดพิษณุโลก", "#ของฝาก", "#streetfood"],
    explanation: "ช้อปปิ้งของฝากและลองชิมอาหารท้องถิ่นที่ตลาดริมน้ำน่าน บรรยากาศคึกคักยามค่ำคืน",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
    address: "ริมแม่น้ำน่าน ตำบลในเมือง พิษณุโลก",
    hours: "05:00 PM – 11:00 PM (Daily)",
    phone: "+66 86 789 0123",
  },
];
