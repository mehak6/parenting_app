import { Activity } from '../types';

export const activities: Activity[] = [
  {
    id: '1',
    name: 'The "Everything" Soup',
    minAge: 18,
    maxAge: 48,
    moods: ['Creative', 'Learning'],
    parentEnergy: 'Low',
    timeRequired: '15min+',
    materials: ['Large bowl', 'Water', 'Plastic spoons', 'Safe kitchen items (whisk, measuring cups)'],
    instructions: [
      'Fill a large bowl with a bit of water.',
      'Give your child various safe kitchen tools and let them "cook".',
      'Encourage them to describe what soup they are making.'
    ],
    skillFocus: ['Fine Motor', 'Sensory'],
    isLowEnergy: true,
    proTip: "Sensory play like this helps build nerve connections in the brain's pathways, supporting language development and problem solving!",
    context: ['Home', 'Outdoor']
  },
  {
    id: '2',
    name: 'Indoor Scavenger Hunt',
    minAge: 36,
    maxAge: 120,
    moods: ['Active'],
    parentEnergy: 'Low',
    timeRequired: '10min',
    materials: ['None'],
    instructions: [
      'Ask your child to find "something red", "something soft", or "something that makes noise".',
      'Stay on the couch while they bring the items to you.',
      'Celebrate each find!'
    ],
    skillFocus: ['Observation', 'Movement'],
    isLowEnergy: true,
    proTip: "Observation games sharpen visual discrimination skills, which are crucial for reading readiness.",
    context: ['Home']
  },
  {
    id: '3',
    name: 'Balloon Tennis',
    minAge: 36,
    maxAge: 96,
    moods: ['Active'],
    parentEnergy: 'Medium',
    timeRequired: '10min',
    materials: ['Balloon', 'Paper plates (optional for rackets)', 'Hands'],
    instructions: [
      'Blow up a balloon.',
      'Try to keep it in the air using only hands or paper plate "rackets".',
      'Count how many times you can hit it before it touches the ground.'
    ],
    skillFocus: ['Gross Motor', 'Coordination'],
    isLowEnergy: false,
    proTip: "Big movements help build core strength, coordination, and confidence in their physical abilities.",
    context: ['Home']
  },
  {
    id: '4',
    name: 'Shadow Puppets',
    minAge: 24,
    maxAge: 120,
    moods: ['Calm', 'Creative'],
    parentEnergy: 'Low',
    timeRequired: '5min',
    materials: ['Flashlight or Phone light', 'Blank wall'],
    instructions: [
      'Dim the lights.',
      'Use your hands to make shapes on the wall.',
      'Let your child try to copy or guess what the animal is.'
    ],
    skillFocus: ['Imagination', 'Fine Motor'],
    isLowEnergy: true,
    proTip: "Imaginative play fosters creativity and helps children work through emotions and understand the world around them.",
    context: ['Home', 'Tent']
  },
  {
    id: '5',
    name: 'Sticker Line Trace',
    minAge: 30,
    maxAge: 60,
    moods: ['Learning', 'Creative'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Paper', 'Markers', 'Stickers'],
    instructions: [
      'Draw different types of lines on a piece of paper (zigzag, wavy, straight).',
      'Have your child place stickers along the lines.',
      'This helps with focus and precision.'
    ],
    skillFocus: ['Fine Motor', 'Concentration'],
    isLowEnergy: false,
    proTip: "Activities like this strengthen small hand muscles, essential for writing and buttoning clothes later on!",
    context: ['Home', 'Restaurant', 'Plane']
  },
  {
    id: '6',
    name: 'Dance Party',
    minAge: 18,
    maxAge: 120,
    moods: ['Active', 'Restless'],
    parentEnergy: 'High',
    timeRequired: '5min',
    materials: ['Music'],
    instructions: [
      'Put on your favorite upbeat song.',
      'Dance together wildly.',
      'Freeze when the music stops.'
    ],
    skillFocus: ['Gross Motor', 'Rhythm'],
    isLowEnergy: false,
    proTip: "Big movements help build core strength, coordination, and confidence in their physical abilities.",
    context: ['Home']
  },
  {
    id: '7',
    name: 'Tape Road',
    minAge: 24,
    maxAge: 72,
    moods: ['Creative', 'Active'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Masking tape or Painters tape', 'Toy cars'],
    instructions: [
      'Tape "roads" on the floor or carpet.',
      'Add "parking spots" or "roundabouts".',
      'Let your child drive their cars along the tape paths.'
    ],
    skillFocus: ['Imagination', 'Fine Motor'],
    isLowEnergy: false,
    proTip: "Imaginative play fosters creativity and helps children work through emotions and understand the world around them.",
    context: ['Home']
  },
  {
    id: '8',
    name: 'Ice Cube Rescue',
    minAge: 24,
    maxAge: 60,
    moods: ['Learning', 'Calm'],
    parentEnergy: 'Low',
    timeRequired: '15min+',
    materials: ['Ice cubes with small toys frozen inside', 'Warm water', 'Dropper or Spoon'],
    instructions: [
      'Freeze small waterproof toys in ice cubes overnight.',
      'Give your child the ice cubes and a bowl of warm water.',
      'Let them "rescue" the toys by melting the ice.'
    ],
    skillFocus: ['Sensory', 'Patience'],
    isLowEnergy: true,
    proTip: "Sensory play builds nerve connections in the brain's pathways, which leads to the child's ability to complete more complex learning tasks.",
    context: ['Home', 'Outdoor']
  },
  {
    id: '9',
    name: 'Sorting Laundry',
    minAge: 24,
    maxAge: 48,
    moods: ['Learning'],
    parentEnergy: 'Low',
    timeRequired: '10min',
    materials: ['Clean laundry'],
    instructions: [
      'Give your child a pile of clean socks.',
      'Ask them to find matching pairs.',
      'Or sort clothes by color.'
    ],
    skillFocus: ['Logic', 'Color Recognition'],
    isLowEnergy: true,
    proTip: "Matching socks builds early math skills (classification) and visual discrimination!",
    context: ['Home']
  },
  {
    id: '10',
    name: 'Cardboard Box Fort',
    minAge: 18,
    maxAge: 120,
    moods: ['Creative', 'Calm'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Large cardboard box', 'Crayons/Markers', 'Blankets'],
    instructions: [
      'Give your child a large box.',
      'Let them draw on it or crawl inside.',
      'Add blankets to make it a cozy "reading nook".'
    ],
    skillFocus: ['Imagination', 'Spatial Awareness'],
    isLowEnergy: false,
    proTip: "Imaginative play fosters creativity and helps children work through emotions and understand the world around them.",
    context: ['Home']
  },
  {
    id: '11',
    name: 'Pillow Obstacle Course',
    minAge: 18,
    maxAge: 60,
    moods: ['Active'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Pillows', 'Cushions', 'Blankets'],
    instructions: [
      'Line up pillows and cushions on the floor.',
      'Challenge your child to walk from one end to the other without touching the floor.',
      'Make it harder by spacing them out.'
    ],
    skillFocus: ['Gross Motor', 'Balance'],
    isLowEnergy: false,
    proTip: "Big movements help build core strength, coordination, and confidence in their physical abilities.",
    context: ['Home']
  },
  {
    id: '12',
    name: 'Mirror Mimic',
    minAge: 18,
    maxAge: 48,
    moods: ['Calm', 'Learning'],
    parentEnergy: 'Low',
    timeRequired: '5min',
    materials: ['Mirror'],
    instructions: [
      'Sit in front of a mirror with your child.',
      'Make funny faces and have them copy you.',
      'Point to body parts (nose, ears) and name them.'
    ],
    skillFocus: ['Self-Awareness', 'Vocabulary'],
    isLowEnergy: true,
    proTip: "Activities involving mirrors or emotions help children build a sense of self and empathy for others.",
    context: ['Home']
  },
  {
    id: '13',
    name: 'Post-it Peekaboo',
    minAge: 12,
    maxAge: 36,
    moods: ['Calm', 'Learning'],
    parentEnergy: 'Low',
    timeRequired: '10min',
    materials: ['Post-it notes', 'Family photos or toy pictures'],
    instructions: [
      'Cover photos or pictures in a book with Post-it notes.',
      'Let your child lift the flap to "find" the person or object.',
      'Say "Peekaboo!" when they lift it.'
    ],
    skillFocus: ['Fine Motor', 'Object Permanence'],
    isLowEnergy: true,
    proTip: "Activities like this strengthen small hand muscles, essential for writing and buttoning clothes later on!",
    context: ['Home', 'Plane']
  },
  {
    id: '14',
    name: 'Color Hunt',
    minAge: 36,
    maxAge: 72,
    moods: ['Active', 'Learning'],
    parentEnergy: 'Low',
    timeRequired: '10min',
    materials: ['None'],
    instructions: [
      'Pick a color (e.g., "Blue").',
      'Set a timer for 2 minutes.',
      'Have your child collect as many blue items as they can find.'
    ],
    skillFocus: ['Observation', 'Sorting'],
    isLowEnergy: true,
    proTip: "Observation games sharpen visual discrimination skills, which are crucial for reading readiness.",
    context: ['Home', 'Grocery Store', 'Outdoor']
  },
  {
    id: '15',
    name: 'Toilet Roll Binoculars',
    minAge: 36,
    maxAge: 72,
    moods: ['Creative'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['2 Toilet rolls', 'Tape', 'String (optional)', 'Markers'],
    instructions: [
      'Tape two toilet rolls together side-by-side.',
      'Let your child decorate them with markers.',
      'Go on a "safari" around the house looking for stuffed animals.'
    ],
    skillFocus: ['Creativity', 'Imagination'],
    isLowEnergy: false,
    proTip: "Imaginative play fosters creativity and helps children work through emotions and understand the world around them.",
    context: ['Home']
  },
  {
    id: '16',
    name: 'Animal Walk',
    minAge: 24,
    maxAge: 84,
    moods: ['Active', 'Restless'],
    parentEnergy: 'Medium',
    timeRequired: '5min',
    materials: ['None'],
    instructions: [
      'Call out an animal (e.g., "Elephant").',
      'Stomp, crawl, or hop like that animal across the room.',
      'Take turns picking the animal.'
    ],
    skillFocus: ['Gross Motor', 'Imagination'],
    isLowEnergy: false,
    proTip: "Big movements help build core strength, coordination, and confidence in their physical abilities.",
    context: ['Home', 'Outdoor', 'Park']
  },
  {
    id: '17',
    name: 'Water Painting',
    minAge: 18,
    maxAge: 60,
    moods: ['Creative', 'Calm'],
    parentEnergy: 'Low',
    timeRequired: '15min+',
    materials: ['Cup of water', 'Paintbrush or clean sponge', 'Colored construction paper or cardboard'],
    instructions: [
      'Dip the brush in water.',
      'Paint on the colored paper – it turns dark like magic!',
      'Watch it disappear as it dries. Mess-free!'
    ],
    skillFocus: ['Fine Motor', 'Creativity'],
    isLowEnergy: true,
    proTip: "Activities like this strengthen small hand muscles, essential for writing and buttoning clothes later on!",
    context: ['Home', 'Restaurant']
  },
  {
    id: '18',
    name: 'Cotton Ball Race',
    minAge: 36,
    maxAge: 84,
    moods: ['Active'],
    parentEnergy: 'Medium',
    timeRequired: '10min',
    materials: ['Cotton balls', 'Straws (optional)', 'Tape for finish line'],
    instructions: [
      'Place cotton balls on one end of a table.',
      'Blow them to the other side using a straw or just your mouth.',
      'See who can get theirs across first.'
    ],
    skillFocus: ['Oral Motor', 'Breath Control'],
    isLowEnergy: false,
    proTip: "Oral motor exercises support speech clarity and can have a calming effect on the nervous system.",
    context: ['Home', 'Restaurant']
  },
  {
    id: '19',
    name: 'Mystery Bag',
    minAge: 24,
    maxAge: 60,
    moods: ['Calm', 'Learning'],
    parentEnergy: 'Low',
    timeRequired: '10min',
    materials: ['Pillowcase or opaque bag', 'Household objects (spoon, ball, brush)'],
    instructions: [
      'Hide an object inside the bag.',
      'Let your child feel it from the outside and guess what it is.',
      'Pull it out to reveal the surprise.'
    ],
    skillFocus: ['Sensory', 'Critical Thinking'],
    isLowEnergy: true,
    proTip: "Sensory play builds nerve connections in the brain's pathways, which leads to the child's ability to complete more complex learning tasks.",
    context: ['Home', 'Car', 'Plane']
  },
  {
    id: '20',
    name: 'Freeze Dance',
    minAge: 24,
    maxAge: 120,
    moods: ['Active', 'Restless'],
    parentEnergy: 'Medium',
    timeRequired: '10min',
    materials: ['Music'],
    instructions: [
      'Play music and dance.',
      'Pause the music randomly.',
      'Everyone must freeze in their pose until the music starts again.'
    ],
    skillFocus: ['Listening', 'Self-Control'],
    isLowEnergy: false,
    proTip: "Active listening games improve auditory processing and attention span, key skills for school success.",
    context: ['Home']
  },
  {
    id: '21',
    name: 'Paper Airplane Airport',
    minAge: 48,
    maxAge: 120,
    moods: ['Creative', 'Active'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Paper', 'Hula hoop or laundry basket (target)'],
    instructions: [
      'Fold paper airplanes together.',
      'Set up a "landing strip" or target.',
      'Try to fly the planes into the target.'
    ],
    skillFocus: ['Fine Motor', 'Gross Motor'],
    isLowEnergy: false,
    proTip: "Activities like this strengthen small hand muscles, essential for writing and buttoning clothes later on!",
    context: ['Home', 'Outdoor']
  },
  {
    id: '22',
    name: 'Whisper Challenge',
    minAge: 48,
    maxAge: 120,
    moods: ['Calm'],
    parentEnergy: 'Low',
    timeRequired: '10min',
    materials: ['None'],
    instructions: [
      'Whisper a funny sentence to your child.',
      'See if they can repeat it back exactly.',
      'Or play "Telephone" if you have more people.'
    ],
    skillFocus: ['Listening', 'Auditory Processing'],
    isLowEnergy: true,
    proTip: "Active listening games improve auditory processing and attention span, key skills for school success.",
    context: ['Home', 'Car', 'Restaurant', 'Plane', 'Waiting Room']
  },
  {
    id: '23',
    name: 'Tin Foil Sculptures',
    minAge: 36,
    maxAge: 96,
    moods: ['Creative'],
    parentEnergy: 'Low',
    timeRequired: '15min+',
    materials: ['Aluminum foil sheets'],
    instructions: [
      'Give your child sheets of foil.',
      'Crunch and mold them into shapes (snakes, balls, snowmen).',
      'No glue or tape needed!'
    ],
    skillFocus: ['Fine Motor', 'Creativity'],
    isLowEnergy: true,
    proTip: "Activities like this strengthen small hand muscles, essential for writing and buttoning clothes later on!",
    context: ['Home', 'Restaurant', 'Plane']
  },
  {
    id: '24',
    name: 'Balance Beam Tape',
    minAge: 24,
    maxAge: 72,
    moods: ['Active'],
    parentEnergy: 'Low',
    timeRequired: '10min',
    materials: ['Masking tape'],
    instructions: [
      'Put a long strip of tape on the floor.',
      'Have your child walk "heel-to-toe" across it.',
      'Try walking backwards for a challenge.'
    ],
    skillFocus: ['Balance', 'Gross Motor'],
    isLowEnergy: true,
    proTip: "Developing balance helps with overall body control, coordination, and focus.",
    context: ['Home']
  },
  {
    id: '25',
    name: 'Magazine Collage',
    minAge: 48,
    maxAge: 120,
    moods: ['Creative', 'Calm'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Old magazines', 'Safety scissors', 'Glue', 'Paper'],
    instructions: [
      'Cut out pictures of things you like (foods, animals, colors).',
      'Glue them onto a sheet of paper to make a collage.',
      'Talk about why they chose each picture.'
    ],
    skillFocus: ['Fine Motor', 'Self-Expression'],
    isLowEnergy: false,
    proTip: "Activities like this strengthen small hand muscles, essential for writing and buttoning clothes later on!",
    context: ['Home']
  },
  {
    id: '26',
    name: 'Keep It Up',
    minAge: 48,
    maxAge: 120,
    moods: ['Active'],
    parentEnergy: 'Medium',
    timeRequired: '10min',
    materials: ['Feather or Tissue'],
    instructions: [
      'Toss a feather or tissue in the air.',
      'Keep it from touching the ground by blowing on it from underneath.',
      'No hands allowed!'
    ],
    skillFocus: ['Breath Control', 'Coordination'],
    isLowEnergy: false,
    proTip: "Oral motor exercises support speech clarity and can have a calming effect on the nervous system.",
    context: ['Home']
  },
  {
    id: '27',
    name: 'Measuring Mission',
    minAge: 48,
    maxAge: 96,
    moods: ['Learning'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Measuring tape or Ruler', 'Paper and pencil'],
    instructions: [
      'Ask your child to measure 5 things in the room.',
      'Help them read the numbers.',
      'Record the results: "The couch is 6 feet long!"'
    ],
    skillFocus: ['Math', 'Observation'],
    isLowEnergy: false,
    proTip: "Observation games sharpen visual discrimination skills, which are crucial for reading readiness.",
    context: ['Home']
  },
  {
    id: '28',
    name: 'Sock Basketball',
    minAge: 24,
    maxAge: 120,
    moods: ['Active'],
    parentEnergy: 'Low',
    timeRequired: '10min',
    materials: ['Rolled up socks', 'Laundry basket'],
    instructions: [
      'Place the basket a few feet away.',
      'Take turns throwing sock "balls" into the basket.',
      'Move the basket further back after each success.'
    ],
    skillFocus: ['Gross Motor', 'Coordination'],
    isLowEnergy: true,
    proTip: "Big movements help build core strength, coordination, and confidence in their physical abilities.",
    context: ['Home']
  },
  {
    id: '29',
    name: 'Texture Rubbing',
    minAge: 36,
    maxAge: 84,
    moods: ['Creative'],
    parentEnergy: 'Low',
    timeRequired: '15min+',
    materials: ['Paper', 'Crayons (peeled)', 'Textured surfaces (coins, leaves, wall)'],
    instructions: [
      'Place paper over a textured object.',
      'Rub the side of a crayon over the paper.',
      'Watch the pattern appear!'
    ],
    skillFocus: ['Fine Motor', 'Sensory'],
    isLowEnergy: true,
    proTip: "Activities like this strengthen small hand muscles, essential for writing and buttoning clothes later on!",
    context: ['Home', 'Restaurant']
  },
  {
    id: '30',
    name: 'Building Bridges',
    minAge: 48,
    maxAge: 96,
    moods: ['Learning', 'Creative'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Cups', 'Popsicle sticks or cardboard strips', 'Small toys'],
    instructions: [
      'Use cups as pillars and sticks as beams.',
      'Try to build a bridge strong enough to hold a toy car.',
      'Experiment with different designs.'
    ],
    skillFocus: ['STEM', 'Problem Solving'],
    isLowEnergy: false,
    proTip: "Simple building challenges encourage problem-solving, planning, and understanding cause-and-effect.",
    context: ['Home']
  },
  {
    id: '31',
    name: 'Home-made Sundial',
    minAge: 72,
    maxAge: 120,
    moods: ['Learning', 'Creative'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Paper plate', 'Pencil or stick', 'Markers'],
    instructions: [
      'Poke a hole in the center of the plate and stand the pencil upright.',
      'Place it in a sunny spot outdoors at noon and mark the shadow with "12".',
      'Check back every hour to mark the shadow\'s movement.'
    ],
    skillFocus: ['STEM', 'Astronomy'],
    isLowEnergy: false,
    proTip: "This hands-on experiment teaches children about the Earth\'s rotation and how ancient civilizations kept time!",
    context: ['Outdoor', 'Home']
  },
  {
    id: '32',
    name: 'Stop-Motion Movie',
    minAge: 84,
    maxAge: 120,
    moods: ['Creative', 'Learning'],
    parentEnergy: 'Low',
    timeRequired: '15min+',
    materials: ['Smartphone or Tablet', 'Toys (LEGO, dolls)', 'Stop-motion app (free)'],
    instructions: [
      'Set up a scene with toys.',
      'Take a photo, move the toys slightly, and take another.',
      'Repeat 20+ times and play it back to see your "movie"!'
    ],
    skillFocus: ['Technology', 'Patience'],
    isLowEnergy: true,
    proTip: "Stop-motion animation builds planning skills and teaches the concept of frame rates in digital media.",
    context: ['Home', 'Restaurant', 'Plane', 'Car']
  },
  {
    id: '33',
    name: 'Household Engineering',
    minAge: 72,
    maxAge: 120,
    moods: ['Active', 'Learning'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Recyclables (bottles, boxes)', 'Tape', 'Rubber bands'],
    instructions: [
      'Challenge: Build a car that can roll 3 feet using only these materials.',
      'Add rubber bands to create "engine" power.',
      'Test, refine, and race!'
    ],
    skillFocus: ['STEM', 'Engineering'],
    isLowEnergy: false,
    proTip: "Iterative design—testing and fixing—is the core of engineering and builds resilience in the face of failure.",
    context: ['Home']
  },
  {
    id: '34',
    name: 'Secret Code Message',
    minAge: 72,
    maxAge: 120,
    moods: ['Learning', 'Calm'],
    parentEnergy: 'Low',
    timeRequired: '10min',
    materials: ['Paper', 'Pencil'],
    instructions: [
      'Create a "Cipher" (e.g., A=1, B=2, or A=Z, B=Y).',
      'Write a secret message to someone in the house.',
      'Provide the key so they can decode it.'
    ],
    skillFocus: ['Logic', 'Cryptography'],
    isLowEnergy: true,
    proTip: "Cryptography builds pattern recognition and logical reasoning skills essential for mathematics.",
    context: ['Home', 'School', 'Restaurant', 'Plane']
  },
  {
    id: '35',
    name: 'DIY Cardboard Maze',
    minAge: 60,
    maxAge: 120,
    moods: ['Creative', 'Active'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Cardboard box lid', 'Straws or strips of paper', 'Glue', 'Marble or small ball'],
    instructions: [
      'Glue straws to the lid to create a maze path.',
      'Add "dead ends" and a clear finish line.',
      'Tilt the lid to navigate the marble through your maze.'
    ],
    skillFocus: ['Spatial Awareness', 'Design'],
    isLowEnergy: false,
    proTip: "Creating mazes helps children visualize paths and understand spatial relationships from a bird's-eye view.",
    context: ['Home']
  },
  {
    id: '36',
    name: 'The 100-Cup Tower',
    minAge: 60,
    maxAge: 120,
    moods: ['Active', 'Restless'],
    parentEnergy: 'Low',
    timeRequired: '15min+',
    materials: ['100 Disposable cups (plastic or paper)'],
    instructions: [
      'Challenge: Use all 100 cups to build the tallest tower possible.',
      'Experiment with base widths (wide vs narrow).',
      'Try to build a pyramid or a hollow tower.'
    ],
    skillFocus: ['STEM', 'Persistence'],
    isLowEnergy: true,
    proTip: "Building big structures teaches balance, gravity, and the importance of a strong foundation.",
    context: ['Home']
  },
  {
    id: '37',
    name: 'Paper Bridge Challenge',
    minAge: 84,
    maxAge: 120,
    moods: ['Learning'],
    parentEnergy: 'Low',
    timeRequired: '15min+',
    materials: ['Two stacks of books', 'One sheet of paper', 'Pennies or small weights'],
    instructions: [
      'Place paper across the books (the "bridge").',
      'Challenge: Fold the paper to make it strong enough to hold 20 pennies.',
      'Hint: Try accordion folds (triangles are strong!).'
    ],
    skillFocus: ['STEM', 'Structural Integrity'],
    isLowEnergy: true,
    proTip: "This reveals how the SHAPE of a material can be more important than the material itself for strength.",
    context: ['Home', 'Restaurant']
  },
  {
    id: '38',
    name: 'Nature Journaling',
    minAge: 72,
    maxAge: 120,
    moods: ['Calm', 'Learning'],
    parentEnergy: 'Low',
    timeRequired: '15min+',
    materials: ['Notebook', 'Colored pencils', 'A window or backyard'],
    instructions: [
      'Find one thing outside (a leaf, an insect, a cloud).',
      'Draw it in detail and write 3 observations (color, shape, behavior).',
      'Date the entry to start a collection.'
    ],
    skillFocus: ['Scientific Observation', 'Art'],
    isLowEnergy: true,
    proTip: "Nature journaling encourages mindfulness and detailed observation, slowing down the brain to focus.",
    context: ['Outdoor', 'Park', 'Home']
  },
  {
    id: '39',
    name: 'Reverse Engineering',
    minAge: 96,
    maxAge: 120,
    moods: ['Learning', 'Creative'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Broken old toy or non-functional remote', 'Small screwdriver', 'Adult supervision'],
    instructions: [
      'Carefully take apart the item to see what is inside.',
      'Try to identify wires, buttons, and circuit boards.',
      'Discuss: How did this work when it was whole?'
    ],
    skillFocus: ['STEM', 'Curiosity'],
    isLowEnergy: false,
    proTip: "Deconstruction is a powerful way to learn how things work, demystifying the technology we use every day.",
    context: ['Home']
  },
  {
    id: '40',
    name: 'Indoor Mini-Golf',
    minAge: 60,
    maxAge: 120,
    moods: ['Active', 'Creative'],
    parentEnergy: 'Medium',
    timeRequired: '15min+',
    materials: ['Plastic cups', 'Broom or stick', 'Small ball', 'Tape'],
    instructions: [
      'Tape cups on their sides to the floor as "holes".',
      'Create obstacles using books or shoes.',
      'Try to hit the ball into each hole with the least amount of "strokes".'
    ],
    skillFocus: ['Gross Motor', 'Physics'],
    isLowEnergy: false,
    proTip: "Sports like this teach trajectory, force control, and good sportsmanship.",
    context: ['Home']
  }
];
