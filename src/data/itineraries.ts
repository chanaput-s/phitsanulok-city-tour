export type ItineraryStop = {
  id: string;
  time: string;
  name: string;
  description: string;
  category: string;
  position: [number, number];
  img: string;
};

export type Tour = {
  id: string;
  title: string;
  description: string;
  durationLabel: string;
  stops: ItineraryStop[];
};

export const ITINERARIES: Record<string, Tour[]> = {
  en: [
    {
      id: "heritage-1",
      title: "Phitsanulok Heritage",
      description: "Discover the rich history, culture, and local lifestyle of Phitsanulok along the Nan River.",
      durationLabel: "1-Day Tour",
      stops: [
        {
          id: "stop-1",
          time: "09:00 AM",
          name: "Wat Phra Si Rattana Mahathat",
          description: "Start your day visiting the most sacred temple in Phitsanulok, home to the beautiful Phra Buddha Chinnarat.",
          category: "Temple",
          position: [16.8235, 100.2608],
          img: "https://images.unsplash.com/photo-1540610996881-1bc54ee5512b?q=80&w=800",
        },
        {
          id: "stop-2",
          time: "11:00 AM",
          name: "Chan Royal Palace",
          description: "Explore the historical ruins of the Chan Royal Palace, the birthplace of King Naresuan the Great.",
          category: "Historical",
          position: [16.8270, 100.2580],
          img: "https://images.unsplash.com/photo-1552353617-3bfd679b10b0?q=80&w=800",
        },
        {
          id: "stop-3",
          time: "14:00 PM",
          name: "River Nan Night Market",
          description: "End your day enjoying local street food and shopping along the beautiful Nan River.",
          category: "Food & Shop",
          position: [16.8200, 100.2640],
          img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
        },
        {
          id: "stop-4",
          time: "18:00 PM",
          name: "Sergeant Major Thawee Folk Museum",
          description: "Learn about the local history, culture, and traditional tools of the region in this fascinating museum.",
          category: "Museum",
          position: [16.8120, 100.2740],
          img: "https://images.unsplash.com/photo-1563294336-16d7a4cb88dd?q=80&w=800",
        },
      ]
    },
    {
      id: "cafe-art-1",
      title: "Cafe & Art Hopping",
      description: "Experience the modern side of the city with a day exploring aesthetic cafes, art spaces, and local creative spots.",
      durationLabel: "Half-Day Tour",
      stops: [
        {
          id: "stop-1",
          time: "10:00 AM",
          name: "Made for Mouth Cafe",
          description: "Start the morning with signature coffee and fresh pastries in a minimalist setting.",
          category: "Food",
          position: [16.8210, 100.2550],
          img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800",
        },
        {
          id: "stop-2",
          time: "12:00 PM",
          name: "Nan River Art Gallery",
          description: "Discover contemporary artworks and photography by talented local artists.",
          category: "Museum",
          position: [16.8180, 100.2600],
          img: "https://images.unsplash.com/photo-1518998053401-a41455142374?q=80&w=800",
        },
        {
          id: "stop-3",
          time: "14:30 PM",
          name: "Pae the River",
          description: "Enjoy a late lunch at the floating restaurant by the river with picturesque views.",
          category: "Food & Shop",
          position: [16.8150, 100.2670],
          img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800",
        }
      ]
    }
  ],
  th: [
    {
      id: "heritage-1",
      title: "มรดกเมืองพิษณุโลก",
      description: "ค้นพบประวัติศาสตร์ วัฒนธรรม และวิถีชีวิตท้องถิ่นที่อุดมสมบูรณ์ของเมืองพิษณุโลกริมแม่น้ำน่าน",
      durationLabel: "ทัวร์ 1 วัน",
      stops: [
        {
          id: "stop-1",
          time: "09:00 น.",
          name: "วัดพระศรีรัตนมหาธาตุวรมหาวิหาร",
          description: "เริ่มต้นวันใหม่ด้วยการเยือนวัดที่ศักดิ์สิทธิ์ที่สุดในพิษณุโลก ซึ่งเป็นที่ประดิษฐานของพระพุทธชินราชที่งดงาม",
          category: "วัด",
          position: [16.8235, 100.2608],
          img: "https://images.unsplash.com/photo-1540610996881-1bc54ee5512b?q=80&w=800",
        },
        {
          id: "stop-2",
          time: "11:00 น.",
          name: "พระราชวังจันทน์",
          description: "สำรวจซากปรักหักพังทางประวัติศาสตร์ของพระราชวังจันทน์ ซึ่งเป็นสถานที่พระราชสมภพของสมเด็จพระนเรศวรมหาราช",
          category: "ประวัติศาสตร์",
          position: [16.8270, 100.2580],
          img: "https://images.unsplash.com/photo-1552353617-3bfd679b10b0?q=80&w=800",
        },
        {
          id: "stop-3",
          time: "14:00 น.",
          name: "ตลาดริมน้ำน่าน",
          description: "ปิดท้ายวันด้วยการเพลิดเพลินกับอาหารท้องถิ่นและการช้อปปิ้งริมแม่น้ำน่านที่สวยงาม",
          category: "อาหารและการช้อปปิ้ง",
          position: [16.8200, 100.2640],
          img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
        },
        {
          id: "stop-4",
          time: "18:00 น.",
          name: "พิพิธภัณฑ์พื้นบ้านจ่าทวี",
          description: "เรียนรู้เกี่ยวกับประวัติศาสตร์ท้องถิ่น วัฒนธรรม และเครื่องมือดั้งเดิมของภูมิภาคในพิพิธภัณฑ์ที่น่าสนใจแห่งนี้",
          category: "พิพิธภัณฑ์",
          position: [16.8120, 100.2740],
          img: "https://images.unsplash.com/photo-1563294336-16d7a4cb88dd?q=80&w=800",
        },
      ]
    },
    {
      id: "cafe-art-1",
      title: "คาเฟ่และศิลปะห้ามพลาด",
      description: "สัมผัสมุมมองที่ทันสมัยของเมืองกับการสำรวจคาเฟ่ความงาม พื้นที่ศิลปะ และจุดสร้างสรรค์ของคนในท้องถิ่นในครึ่งวัน",
      durationLabel: "ทัวร์ครึ่งวัน",
      stops: [
        {
          id: "stop-1",
          time: "10:00 น.",
          name: "Made for Mouth Cafe",
          description: "เริ่มต้นเช้าวันใหม่ด้วยกาแฟซิกเนเจอร์และขนมอบสดใหม่ในบรรยากาศสไตล์มินิมอล",
          category: "อาหาร",
          position: [16.8210, 100.2550],
          img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800",
        },
        {
          id: "stop-2",
          time: "12:00 น.",
          name: "หอศิลป์ริมแม่น้ำน่าน",
          description: "ค้นพบผลงานศิลปะร่วมสมัยและภาพถ่ายจากศิลปินท้องถิ่นมากความสามารถ",
          category: "พิพิธภัณฑ์",
          position: [16.8180, 100.2600],
          img: "https://images.unsplash.com/photo-1518998053401-a41455142374?q=80&w=800",
        },
        {
          id: "stop-3",
          time: "14:30 น.",
          name: "Pae the River",
          description: "พักทานอาหารกลางวันหรือของว่างยามบ่ายที่ร้านอาหารลอยน้ำริมแม่น้ำวิวที่งดงาม",
          category: "อาหารและการช้อปปิ้ง",
          position: [16.8150, 100.2670],
          img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800",
        }
      ]
    }
  ]
};
