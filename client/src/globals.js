const categories = [
  {
    label: "Select Category",
    value: "0",
    subCategories: [
      {
        label: "Select SubCategory",
        value: "0",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
        ],
      },
    ],
  },
  {
    label: "Electricity Products",
    value: "1",
    subCategories: [
      {
        label: "Select SubCategory",
        value: "0",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
        ],
      },
      {
        label: "Air Conditioning",
        value: "1",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Ceiling Fan",
            value: "1",
          },
          {
            label: "Wall Fan",
            value: "2",
          },
          {
            label: "Heater",
            value: "3",
          },
          {
            label: "Portable Air Conditioner",
            value: "4",
          },
          {
            label: "Radiator",
            value: "5",
          },
        ],
      },
      {
        label: "Baking",
        value: "2",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Bread Machine",
            value: "1",
          },
          {
            label: "Integrated Oven",
            value: "2",
          },
          {
            label: "Turbo Oven",
            value: "3",
          },
          {
            label: "Built-In Oven",
            value: "4",
          },
          {
            label: "Mini Oven",
            value: "5",
          },
        ],
      },
      {
        label: "Clothing",
        value: "3",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Dryer",
            value: "1",
          },
          {
            label: "Washing Machine",
            value: "2",
          },
          {
            label: "Integrated Washing Machine",
            value: "3",
          },
          {
            label: "Electric Blanket",
            value: "4",
          },
          {
            label: "Iron",
            value: "5",
          },
        ],
      },
      {
        label: "Cooking",
        value: "4",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Mixer",
            value: "1",
          },
          {
            label: "Blender",
            value: "2",
          },
          {
            label: "Shaker",
            value: "3",
          },
          {
            label: "Ice Cream Machine",
            value: "4",
          },
          {
            label: "Juicer",
            value: "5",
          },
          {
            label: "Food Processor",
            value: "6",
          },
        ],
      },
      {
        label: "Devices",
        value: "5",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "DVD",
            value: "1",
          },
          {
            label: "TV",
            value: "2",
          },
          {
            label: "Projector",
            value: "3",
          },
          {
            label: "Streamer",
            value: "4",
          },
          {
            label: "Video",
            value: "5",
          },
        ],
      },
    ],
  },
  {
    label: "Furniture",
    value: "2",
    subCategories: [
      {
        label: "Select SubCategory",
        value: "0",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
        ],
      },
      {
        label: "Chair",
        value: "1",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Easy-chair",
            value: "1",
          },
          {
            label: "Rocking Chair",
            value: "2",
          },
          {
            label: "Executive Chair",
            value: "3",
          },
          {
            label: "Bar Stool",
            value: "4",
          },
          {
            label: "Massage Armchair",
            value: "5",
          },
        ],
      },
      {
        label: "Living Room",
        value: "2",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Coffee Table",
            value: "1",
          },
          {
            label: "Dining Table",
            value: "2",
          },
          {
            label: "Sofa",
            value: "3",
          },
          {
            label: "Mirror",
            value: "4",
          },
          {
            label: "Carpet",
            value: "5",
          },
        ],
      },
      {
        label: "Storage",
        value: "3",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Dresser",
            value: "1",
          },
          {
            label: "Beehive",
            value: "2",
          },
          {
            label: "Closet",
            value: "3",
          },
          {
            label: "Bookcase",
            value: "4",
          },
          {
            label: "Clothing Rack",
            value: "5",
          },
        ],
      },
    ],
  },
  {
    label: "Sports",
    value: "3",
    subCategories: [
      {
        label: "Select SubCategory",
        value: "0",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
        ],
      },
      {
        label: "Diving",
        value: "1",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Diving Fins",
            value: "1",
          },
          {
            label: "Dive Computer",
            value: "2",
          },
          {
            label: "Wet Suit",
            value: "3",
          },
          {
            label: "Regulator",
            value: "4",
          },
          {
            label: "Diving Tank",
            value: "5",
          },
        ],
      },
      {
        label: "Water Sports",
        value: "2",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Sup",
            value: "1",
          },
          {
            label: "Kayak",
            value: "2",
          },
          {
            label: "Surfboard",
            value: "3",
          },
          {
            label: "Softboard",
            value: "4",
          },
          {
            label: "Kiteboard",
            value: "5",
          },
        ],
      },
      {
        label: "Gym",
        value: "3",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Treadmill",
            value: "1",
          },
          {
            label: "Dumbles",
            value: "2",
          },
          {
            label: "Exercise Bike",
            value: "3",
          },
          {
            label: "Fitness Sofa",
            value: "4",
          },
          {
            label: "Cross Trainer",
            value: "5",
          },
        ],
      },
      {
        label: "Snowboard",
        value: "4",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Bindings",
            value: "1",
          },
          {
            label: "Gloves",
            value: "2",
          },
          {
            label: "Snowboard Shoes",
            value: "3",
          },
          {
            label: "Snowboard",
            value: "4",
          },
          {
            label: "Goggles",
            value: "5",
          },
        ],
      },
      {
        label: "Tennis",
        value: "5",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Racket",
            value: "1",
          },
          {
            label: "Tennis Balls",
            value: "2",
          },
          {
            label: "Strings",
            value: "3",
          },
          {
            label: "Tennis Bag",
            value: "4",
          },
        ],
      },
    ],
  },
  {
    label: "Gaming",
    value: "4",
    subCategories: [
      {
        label: "Select SubCategory",
        value: "0",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
        ],
      },
      {
        label: "Accessories",
        value: "1",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Xbox Controller",
            value: "1",
          },
          {
            label: "PS2 Joystick",
            value: "2",
          },
          {
            label: "Steering Wheel",
            value: "3",
          },
          {
            label: "Gamer Headphones",
            value: "4",
          },
          {
            label: "VR Glasses",
            value: "5",
          },
        ],
      },
      {
        label: "Game Consoles",
        value: "2",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "PS2",
            value: "1",
          },
          {
            label: "PS3",
            value: "2",
          },
          {
            label: "Xbox One",
            value: "3",
          },
          {
            label: "Xbox 360",
            value: "4",
          },
          {
            label: "Nintendo Switch",
            value: "5",
          },
        ],
      },
      {
        label: "Retro",
        value: "3",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Arcade Machine",
            value: "1",
          },
          {
            label: "Atari Arcade",
            value: "2",
          },
          {
            label: "Nintendo Game Boy",
            value: "3",
          },
          {
            label: "Nintendo Wii",
            value: "4",
          },
        ],
      },
    ],
  },
  {
    label: "Computers",
    value: "5",
    subCategories: [
      {
        label: "Select SubCategory",
        value: "0",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
        ],
      },
      {
        label: "Equipment",
        value: "1",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Mouse",
            value: "1",
          },
          {
            label: "Keyboard",
            value: "2",
          },
          {
            label: "Computer Monitor",
            value: "3",
          },
          {
            label: "CD Burner",
            value: "4",
          },
          {
            label: "Electronic Dictionary",
            value: "5",
          },
        ],
      },
      {
        label: "Network",
        value: "2",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Router",
            value: "1",
          },
          {
            label: "Server",
            value: "2",
          },
          {
            label: "Switch",
            value: "3",
          },
          {
            label: "Range Extender",
            value: "4",
          },
          {
            label: "GPS Navigator",
            value: "4",
          },
        ],
      },
      {
        label: "Office",
        value: "3",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Scanner",
            value: "1",
          },
          {
            label: "Printer",
            value: "2",
          },
          {
            label: "Computer Camera",
            value: "3",
          },
          {
            label: "Apple iPad Air",
            value: "4",
          },
          {
            label: "Apple iPad Mini",
            value: "5",
          },
        ],
      },
    ],
  },
  {
    label: "For Your Garden",
    value: "6",
    subCategories: [
      {
        label: "Select SubCategory",
        value: "0",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
        ],
      },
      {
        label: "Entertainment",
        value: "1",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Trampoline",
            value: "1",
          },
          {
            label: "Inflatable Pool",
            value: "2",
          },
          {
            label: "Inflatable Jacuzzi",
            value: "3",
          },
          {
            label: "Swing",
            value: "4",
          },
          {
            label: "Hammock",
            value: "5",
          },
        ],
      },
      {
        label: "Housing",
        value: "2",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Gazebo",
            value: "1",
          },
          {
            label: "Greenhouse",
            value: "2",
          },
          {
            label: "Pergola",
            value: "3",
          },
          {
            label: "Parasol",
            value: "4",
          },
          {
            label: "Sukkah",
            value: "5",
          },
        ],
      },
      {
        label: "Gardening",
        value: "3",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Lawnmower",
            value: "1",
          },
          {
            label: "Pipe",
            value: "2",
          },
          {
            label: "Water Sprinkler",
            value: "3",
          },
          {
            label: "Projector",
            value: "4",
          },
          {
            label: "Light Pole",
            value: "5",
          },
        ],
      },
    ],
  },
  {
    label: "Home",
    value: "7",
    subCategories: [
      {
        label: "Select SubCategory",
        value: "0",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
        ],
      },
      {
        label: "Cleaning",
        value: "1",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Dish Drying Dispenser",
            value: "1",
          },
          {
            label: "Broom",
            value: "2",
          },
          {
            label: "Ironing Board",
            value: "3",
          },
          {
            label: "Air Freshener",
            value: "4",
          },
          {
            label: "Odor Disseminating",
            value: "5",
          },
        ],
      },
      {
        label: "Hospitality",
        value: "2",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Drinks Cart",
            value: "1",
          },
          {
            label: "Bar Table",
            value: "2",
          },
          {
            label: "Fireplace",
            value: "3",
          },
          {
            label: "Wine Cooler",
            value: "4",
          },
          {
            label: "Hookah",
            value: "5",
          },
        ],
      },
      {
        label: "Maintenance",
        value: "3",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Safe",
            value: "1",
          },
          {
            label: "Ladder",
            value: "2",
          },
          {
            label: "Solar Panels",
            value: "3",
          },
          {
            label: "Gas Tank",
            value: "4",
          },
          {
            label: "Digital Weight",
            value: "5",
          },
        ],
      },
      {
        label: "Outdoors",
        value: "4",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Grill",
            value: "1",
          },
          {
            label: "Tabun Oven",
            value: "2",
          },
          {
            label: "Meat Smoker",
            value: "3",
          },
        ],
      },
    ],
  },
  {
    label: "Music",
    value: "8",
    subCategories: [
      {
        label: "Select SubCategory",
        value: "0",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
        ],
      },
      {
        label: "Amplification",
        value: "1",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Karaoke Equipment",
            value: "1",
          },
          {
            label: "Speaker",
            value: "2",
          },
          {
            label: "JBL Speaker",
            value: "3",
          },
          {
            label: "Amplifier",
            value: "4",
          },
          {
            label: "Subwoofer",
            value: "5",
          },
          {
            label: "Monitor",
            value: "5",
          },
        ],
      },
      {
        label: "Cables",
        value: "2",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "USB Cable",
            value: "1",
          },
          {
            label: "XLR Cable",
            value: "2",
          },
          {
            label: "PL Cable",
            value: "3",
          },
          {
            label: "UDG Cable",
            value: "4",
          },
          {
            label: "RCA Cable",
            value: "5",
          },
        ],
      },
      {
        label: "DJ Tools",
        value: "3",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Mixer",
            value: "1",
          },
          {
            label: "Microphone",
            value: "2",
          },
          {
            label: "Carry-on Box",
            value: "3",
          },
          {
            label: "Control Keyboard",
            value: "4",
          },
          {
            label: "Vinyl Plate",
            value: "5",
          },
        ],
      },
      {
        label: "Lighting",
        value: "4",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Light Reflector",
            value: "1",
          },
          {
            label: "LED Lights",
            value: "2",
          },
          {
            label: "LED Beam Light",
            value: "4",
          },
          {
            label: "Flashing Lights",
            value: "4",
          },
          {
            label: "Laser",
            value: "5",
          },
        ],
      },
      {
        label: "Party",
        value: "5",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Tripod",
            value: "1",
          },
          {
            label: "Microphone Stand",
            value: "2",
          },
          {
            label: "Wagon",
            value: "3",
          },
          {
            label: "Disco Ball",
            value: "4",
          },
          {
            label: "Mix Station",
            value: "5",
          },
        ],
      },
      {
        label: "Recording",
        value: "6",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Sound Card",
            value: "1",
          },
          {
            label: "Acoustic Screen",
            value: "2",
          },
          {
            label: "Electronic Drums",
            value: "3",
          },
          {
            label: "Equalizer",
            value: "4",
          },
          {
            label: "Sound Effect",
            value: "5",
          },
        ],
      },
    ],
  },
  {
    label: "Renovation",
    value: "9",
    subCategories: [
      {
        label: "Select SubCategory",
        value: "0",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
        ],
      },
      {
        label: "Apparel",
        value: "1",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Gloves",
            value: "1",
          },
          {
            label: "Vest",
            value: "2",
          },
          {
            label: "Overall",
            value: "3",
          },
          {
            label: "Helmet",
            value: "4",
          },
          {
            label: "Dust Mask",
            value: "5",
          },
          {
            label: "Eye Wear",
            value: "5",
          },
          {
            label: "Ear Plugs",
            value: "5",
          },
        ],
      },
      {
        label: "Electricity",
        value: "2",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Generator",
            value: "1",
          },
          {
            label: "Compressor",
            value: "2",
          },
          {
            label: "Battery 4A",
            value: "3",
          },
          {
            label: "Welder",
            value: "4",
          },
          {
            label: "Electric Engine",
            value: "5",
          },
          {
            label: "Power Inverter",
            value: "5",
          },
        ],
      },
      {
        label: "Generic Tools",
        value: "3",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Broom",
            value: "1",
          },
          {
            label: "Dustpan",
            value: "2",
          },
          {
            label: "Bucket",
            value: "3",
          },
          {
            label: "Shovel",
            value: "4",
          },
          {
            label: "Wiper",
            value: "5",
          },
        ],
      },
      {
        label: "Measuring Tools",
        value: "4",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Protractor",
            value: "1",
          },
          {
            label: "Tape",
            value: "2",
          },
          {
            label: "Gauge",
            value: "3",
          },
          {
            label: "Level",
            value: "4",
          },
          {
            label: "Micrometer",
            value: "5",
          },
          {
            label: "Square Measure",
            value: "6",
          },
        ],
      },
      {
        label: "Work Tools",
        value: "5",
        products: [
          {
            label: "Select Product",
            value: "0",
          },
          {
            label: "Rotary Hammer",
            value: "1",
          },
          {
            label: "Hammer",
            value: "2",
          },
          {
            label: "Saw",
            value: "3",
          },
          {
            label: "Pliers",
            value: "4",
          },
          {
            label: "Nose Pliers",
            value: "5",
          },
          {
            label: "Pipe Wrench",
            value: "6",
          },
          {
            label: "Monkey Wrench",
            value: "7",
          },
        ],
      },
    ],
  },
];

const cities = [
  {
    label: "Select Area",
    value: "23",
  },
  {
    label: "North",
    value: "0",
  },
  {
    label: "Tel-Aviv Yafo",
    value: "1",
  },
  {
    label: "Haifa",
    value: "2",
  },
  {
    label: "Hadera, Zichron Ya'akov & the Vallies",
    value: "3",
  },
  {
    label: "Caesarea",
    value: "4",
  },
  {
    label: "Eilat",
    value: "5",
  },
  {
    label: "Beit She'an Valley",
    value: "6",
  },
  {
    label: "Netanya",
    value: "7",
  },
  {
    label: "Ramat Hasharon & Herzliya",
    value: "8",
  },
  {
    label: "Ra'anana & Kfar Saba",
    value: "9",
  },
  {
    label: "Center",
    value: "10",
  },
  {
    label: "Tiberias",
    value: "11",
  },
  {
    label: "Kraiot Area",
    value: "12",
  },
  {
    label: "Holon & Bat Yam",
    value: "13",
  },
  {
    label: "Holon & Bat-Yam",
    value: "14",
  },
  {
    label: "Ramat Gan, Givatayim & Bnei-Brak",
    value: "15",
  },
  {
    label: "Shoam",
    value: "16",
  },
  {
    label: "Modi'in",
    value: "17",
  },
  {
    label: "Kiryat Gat",
    value: "18",
  },
  {
    label: "Shfela",
    value: "19",
  },
  {
    label: "South",
    value: "20",
  },
  {
    label: "Be'er Sheva",
    value: "21",
  },
  {
    label: "Ashdod & Ashkelon",
    value: "22",
  },
];

const priceRange = [
  {
    label: "Any",
    value: "10000",
  },
  {
    label: "Up to 50",
    value: "50",
  },
  {
    label: "Up to 100",
    value: "100",
  },
  {
    label: "Up to 150",
    value: "150",
  },
  {
    label: "Up to 200",
    value: "200",
  },
  {
    label: "Up to 400",
    value: "400",
  },
];
/**
 * exports module
 */
module.exports = {
  categories,
  cities,
  priceRange,
};
