export type Difficulty = 'Gentle' | 'Moderate' | 'Bold';

export interface StickyNote {
  tag: string;
  title: string;
  body: string;
  color: 'yellow' | 'rose' | 'amber' | 'sage' | 'blue';
  rotate?: number;
}

export interface SpeechStep {
  time: string;
  phase: string;
  scriptPrompt: string;
  cue: string;
}

export interface DeepSection {
  heading: string;
  body: string;
}

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  category: CategoryId;
  difficulty: Difficulty;
  minutes: number;
  image: string;
  imageAlt: string;
  imageDescription: string;
  description: string;
  keyPoints: string[];
  deepDive: DeepSection[];
  stickyNotes: StickyNote[];
  cinematicVoiceStory: string;
  speechBlueprint: SpeechStep[];
  vocalTechnique: {
    tone: string;
    tempo: string;
    powerPause: string;
    advice: string;
  };
  facts: string[];
  questions: string[];
  vocabulary: string[];
}

export type CategoryId =
  | 'philosophy' | 'science' | 'art' | 'history'
  | 'nature' | 'technology' | 'life' | 'society' | 'business';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  blurb: string;
  coverImage: string;
}

export const difficultyMeta: Record<Difficulty, { label: string; level: string; hint: string; color: string }> = {
  Gentle: { label: 'Low', level: 'Easy', hint: 'Everyday intuitive ideas', color: '#5A6B4A' },
  Moderate: { label: 'Medium', level: 'Balanced', hint: 'Nuanced & layered', color: '#96692C' },
  Bold: { label: 'High', level: 'Challenging', hint: 'Abstract philosophical debate', color: '#9A5537' },
};

const img = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=760&w=1280`;

export const categories: Category[] = [
  { id: 'philosophy', label: 'Philosophy', icon: 'Flame', blurb: 'Ideas that resist easy answers', coverImage: img(38765544) },
  { id: 'science', label: 'Science', icon: 'Atom', blurb: 'Wonder, unravelled & explained', coverImage: img(13314282) },
  { id: 'art', label: 'Art & Culture', icon: 'Palette', blurb: 'Beauty, taste and meaning', coverImage: img(13901052) },
  { id: 'history', label: 'History', icon: 'Landmark', blurb: 'What the past still whispers', coverImage: img(4610741) },
  { id: 'nature', label: 'Nature', icon: 'Leaf', blurb: 'The living intelligence', coverImage: img(14785186) },
  { id: 'technology', label: 'Technology', icon: 'Cpu', blurb: 'Tools that quietly reshape us', coverImage: img(30547618) },
  { id: 'life', label: 'Life & Mind', icon: 'Sparkles', blurb: 'Being conscious, daily', coverImage: img(14240458) },
  { id: 'society', label: 'Society', icon: 'Users', blurb: 'How we build coexistence', coverImage: img(16438456) },
  { id: 'business', label: 'Work & Business', icon: 'Briefcase', blurb: 'Ambition, craft and scale', coverImage: img(13005858) },
];

export const topics: Topic[] = [
  /* ---------------- PHILOSOPHY ---------------- */
  {
    id: 'p1', title: 'The Meaning of Silence', subtitle: 'In an age of perpetual noise',
    category: 'philosophy', difficulty: 'Moderate', minutes: 3,
    image: img(38765544), imageAlt: 'A serene misty winter forest with tall bare trees',
    imageDescription: 'A stark, fog-shrouded winter woodland where skeletal tree branches vanish into absolute white stillness. The photo embodies auditory absence — a sensory canvas stripped bare of modern vibration, where the only sound left is one’s own heartbeat.',
    description: 'Silence is no longer the default state of human life. It has become an endangered luxury — something we must deliberately orchestrate. The way we treat silence reveals whether we are at peace with our own interior monologue.',
    keyPoints: [
      'Before electricity and internal combustion, most human hours were quiet. Constant ambient noise is barely 100 years old.',
      'Neurological research links chronic low-level noise to elevated cortisol and degraded prefrontal cognitive control.',
      'Contemplative traditions — Quaker silent meetings, Vipassana meditation, monastic rules — treat silence as a forge, not an absence.',
      'In rhetoric, the pregnant pause holds supreme authority: the hesitation before a reply commands far more gravity than instant rebuttal.',
    ],
    deepDive: [
      { heading: 'The Vanishing Ambient Void', body: 'For 99.9% of human evolution, silence was the default acoustic condition. The relentless hum of HVAC compressors, server fans, motorways, and notifications arrived in the blink of an evolutionary eye. We have normalized acoustic saturation without realizing its psychological tax.' },
      { heading: 'Acoustic Fasting as Cognitive Medicine', body: 'In clinical trials, subjects exposed to two hours of complete daily silence developed new cells in the hippocampus — the seat of memory. Silence is not sensory deprivation; it is sensory renewal, allowing subconscious memory consolidation.' },
      { heading: 'The Rhetorical Power of the Pause', body: 'Great speakers do not fear the pause; they weaponize it. A two-second silence before delivering a key thesis forces the room to physically adjust their breathing to match yours.' },
    ],
    stickyNotes: [
      { tag: 'Killer Hook', title: 'The 100-Year Noise Experiment', body: 'Remind the audience: our ancestors lived in 90% silence. We are the first generation living inside an unbroken hum.', color: 'yellow', rotate: -2 },
      { tag: 'Core Analogy', title: 'The White Canvas', body: 'Noise is graffiti on the mind; silence is the blank canvas where original thought actually happens.', color: 'rose', rotate: 2 },
      { tag: 'Rhetorical Cue', title: 'Do Not Rush', body: 'Take an actual 2-second dead pause at 0:40 to prove silence works live in your talk.', color: 'amber', rotate: -1 },
    ],
    cinematicVoiceStory: 'Imagine stepping into an old winter cathedral or a dense snowbound birch forest at dusk. The roaring world of notifications, engines, and opinions suddenly drops away like an anchor cutting loose. For the first twenty seconds, your mind scrambles for stimulus. But then, an ancient stillness returns. Silence is not the absence of sound; it is the presence of everything we have been too distracted to feel. Today, choosing silence is the most radical rebellion against a world that profits from our distraction.',
    speechBlueprint: [
      { time: '0:00 - 0:12', phase: 'The Sensory Contrast', scriptPrompt: 'When was the last time you heard absolute, pure silence? Not quiet — but real silence?', cue: 'Speak with a slow, contemplative cadence.' },
      { time: '0:12 - 0:28', phase: 'The Modern Diagnosis', scriptPrompt: 'Explain how 100 years of engine noise has made us terrified of our own thoughts.', cue: 'Increase vocal clarity and punch on "unbroken hum".' },
      { time: '0:28 - 0:45', phase: 'The Biological Fact', scriptPrompt: 'State that silence literally regenerates hippocampal brain cells.', cue: 'Deliver with authoritative, calm confidence.' },
      { time: '0:45 - 1:00', phase: 'The Call to Stillness', scriptPrompt: 'End with: "Silence is not empty. It is full of the answers we run from."', cue: 'Let the final word hang in the air for a second.' },
    ],
    vocalTechnique: {
      tone: 'Atmospheric, measured, reflective, and spacious.',
      tempo: '110-120 words per minute — slower than normal conversation.',
      powerPause: 'Take a deliberate 1.5-second break right before your concluding sentence.',
      advice: 'Avoid filler words like "um" or "like" — replace them with deliberate silence.',
    },
    facts: [
      'Anechoic chambers in Minneapolis are so quiet (-9.4 dBA) you can hear blood flowing through your veins.',
      'John Cage composed 4′33″ in 1952 to prove that ambient room noise is itself accidental music.',
      'The World Health Organization ranks environmental noise as the second worst environmental cause of ill health.',
    ],
    questions: ['When did you last seek out real silence?', 'Is silence comfortable or threatening to you?', 'What does noise cost us that we never notice?'],
    vocabulary: ['ambient', 'contemplative', 'anechoic', 'sensory saturation', 'rhetorical pause'],
  },
  {
    id: 'p2', title: 'The Art of Doing Nothing', subtitle: 'On the value of stillness',
    category: 'philosophy', difficulty: 'Gentle', minutes: 2,
    image: img(1229753), imageAlt: 'A person relaxing in a hammock in a sunlit forest',
    imageDescription: 'Sunlight filters through towering pine boughs onto an unhurried figure suspended between trees. The image captures the lost luxury of unstructured time — zero agenda, zero productivity tracking, purely dwelling in the physical moment.',
    description: 'Modern culture treats idleness as moral failure. Yet linguistics and neuroscience reveal that purposeless rest is the biological cradle of creative insight.',
    keyPoints: [
      'Italian "dolce far niente" and Dutch "niksen" celebrate idleness as a cultivated art form.',
      'The default mode network (DMN) sparks during downtime to synthesize scattered mental data.',
      'Boredom consistently precedes divergent problem-solving in psychological trials.',
      'Rest is not an earned bonus after output; it is the vital metabolic precondition for quality.',
    ],
    deepDive: [
      { heading: 'The Neurobiology of Daydreaming', body: 'When you stop task-directed attention, the brain does not power down. Instead, the Default Mode Network fires up, connecting disparate memories, exploring counterfactual scenarios, and resolving emotional friction.' },
      { heading: 'The Protestant Work Ethic Distortion', body: 'The industrial clock transformed time into units of monetary exchange. Idleness shifted from an aristocratic virtue to a badge of guilt. We now check email on beaches because stillness triggers acute withdrawal from dopamine loops.' },
    ],
    stickyNotes: [
      { tag: 'Master Quote', title: 'Dolce Far Niente', body: '"The sweetness of doing nothing" is not laziness — it is psychological hygiene.', color: 'yellow', rotate: 2 },
      { tag: 'Brain Hack', title: 'The Shower Epiphany', body: 'Remind them why great ideas come in showers: because the brain has zero metrics to hit in that moment.', color: 'sage', rotate: -2 },
      { tag: 'Delivery Tip', title: 'Warm & Reassuring', body: 'Speak with a relaxed, smiling posture to make listeners feel permission to exhale.', color: 'rose', rotate: 1 },
    ],
    cinematicVoiceStory: 'Look at a great tree in winter. It bears no fruit, sprouts no leaves, and performs no visible labour. Yet beneath the frozen loam, deep root systems are drinking, restoring, and storing subterranean vitality for spring. Humans are biological organisms, not industrial machines. When we schedule every second, we starve the soil of our imagination. Doing nothing is not empty time; it is the sacred space where our best thoughts secretly germinate.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Guilt Trap', scriptPrompt: 'Describe the modern twitch of needing to check a phone the second we have a free moment.', cue: 'Use an engaging, candid opening tone.' },
      { time: '0:15 - 0:30', phase: 'The Neurological Defense', scriptPrompt: 'Explain how the brain\u2019s Default Mode Network works while we stare out a window.', cue: 'Sound fascinated and knowledgeable.' },
      { time: '0:30 - 0:48', phase: 'The Cultural Contrast', scriptPrompt: 'Contrast Western hustle culture with Italian "dolce far niente".', cue: 'Warm, lyrical phrasing.' },
      { time: '0:48 - 1:00', phase: 'The Permission Statement', scriptPrompt: 'Conclude: "Rest is not the reward for good work — it is the fertile ground that makes it possible."', cue: 'Deliver with steady, grounded conviction.' },
    ],
    vocalTechnique: {
      tone: 'Warm, conversational, philosophical, and unhurried.',
      tempo: '115 wpm — give ideas room to breathe.',
      powerPause: 'Pause right after describing the phone-checking twitch to let the audience see themselves.',
      advice: 'Breathe from the diaphragm; let your shoulders drop as you speak.',
    },
    facts: [
      'Niksen is an official Dutch wellness practice that specifically means sitting with no purpose.',
      'Archimedes figured out water displacement while soaking in a warm tub with no active agenda.',
      'Creative workers report their top breakthrough insights occur when away from their primary desk.',
    ],
    questions: ['When do your best ideas arrive?', 'Do you feel guilty resting? Why?', 'Is boredom a problem or a resource?'],
    vocabulary: ['default mode network', 'dolce far niente', 'fallow', 'cognitive restoration'],
  },
  {
    id: 'p3', title: 'Time as Experience', subtitle: 'Not measurement, but feeling',
    category: 'philosophy', difficulty: 'Bold', minutes: 3,
    image: img(16591489), imageAlt: 'A vintage gold pocket watch resting on antique books',
    imageDescription: 'A handcrafted golden pocket watch with ticking Roman numerals lies beside weathered, leather-bound encyclopedias. The visual contrasts mechanical, rigid clockwork precision with the organic, fleeting decay of human memory.',
    description: 'An atomic clock measures the identical second across the planet, yet an hour of ecstasy and an hour of grief inhabit entirely different universes. Time is as much a biological hallucination as a coordinate in physics.',
    keyPoints: [
      'Novel sensory input expands retrospective time; monotonous routine compresses it.',
      'Henri Bergson distinguished objective "temps" (clock time) from subjective "durée" (lived flow).',
      'During extreme adrenaline surges, amygdala hyperactivity makes reality appear to run in slow motion.',
      'You can literally lengthen the subjective duration of your life by relentlessly seeking unfamiliar environments.',
    ],
    deepDive: [
      { heading: 'Bergson\u2019s Revolutionary Distinction', body: 'The French thinker Henri Bergson argued that science spatializes time — chopping it into discrete ticks like notches on a ruler. But our consciousness experiences durée: a fluid, indivisible melody where past and future overlap.' },
      { heading: 'The Childhood Summer Paradox', body: 'Childhood summers felt endless because the brain was building novel neural pathways every single day. By age forty, daily commute patterns reuse the same compressed schema, making years flash past in weeks.' },
    ],
    stickyNotes: [
      { tag: 'Mind-Bender', title: 'The Routine Thief', body: 'Monotony is a time thief. When every day looks the same, your brain deletes redundant days from memory.', color: 'amber', rotate: -2 },
      { tag: 'Life Formula', title: 'How to Live 2x Longer', body: 'You can’t add calendar years, but you can double subjective years by injecting radical novelty into every week.', color: 'blue', rotate: 2 },
    ],
    cinematicVoiceStory: 'Look at a watch. The second hand advances with cold, unyielding mechanical symmetry. But your mind knows this is a mathematical illusion. Think back to childhood summers — they felt vast, infinite, shimmering with endless afternoons. Why? Because everything was brand new. When you stop learning and surrender to routine, the brain stops recording detail, and decades compress into a blur. Time is not a prison of minutes; it is the currency of our attention.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Perceptual Paradox', scriptPrompt: 'Contrast 60 seconds on a dentist chair vs 60 seconds kissing someone you love.', cue: 'Start with vivid contrast in your vocal delivery.' },
      { time: '0:15 - 0:32', phase: 'The Bergsonian Idea', scriptPrompt: 'Introduce the difference between clock time and lived duration.', cue: 'Shift to an intellectual, storytelling tone.' },
      { time: '0:32 - 0:48', phase: 'The Childhood Mystery', scriptPrompt: 'Explain why childhood felt twice as long due to neural novelty.', cue: 'Add warmth and nostalgia.' },
      { time: '0:48 - 1:00', phase: 'The Master Challenge', scriptPrompt: 'Close with: "If you want a longer life, don\u2019t just add years — add novelty."', cue: 'Deliver with punch and direct eye-contact.' },
    ],
    vocalTechnique: {
      tone: 'Philosophical, dramatic, energetic, and rhythmic.',
      tempo: 'Build from 110 wpm at the start to a crisp 130 wpm during the childhood paradox.',
      powerPause: 'Pause before the word "dentist chair" to let the mental contrast click.',
      advice: 'Vary your volume slightly between the abstract science and the human memory.',
    },
    facts: [
      'David Eagleman conducted an experiment dropping participants 100 feet to measure time perception during fear.',
      'Fever raises internal metabolic rates, making external clocks appear to tick unnaturally slow.',
      'Circadian rhythms are regulated by a cluster of 20,000 neurons in the hypothalamus called the SCN.',
    ],
    questions: ['When has time felt stretched or collapsed?', 'Does routine steal your years?', 'Can you design a life that feels longer?'],
    vocabulary: ['durée', 'temporal distortion', 'novelty index', 'subjective flow', 'spatialization'],
  },
  {
    id: 'p4', title: 'The Ethics of Attention', subtitle: 'Where we look, we live',
    category: 'philosophy', difficulty: 'Moderate', minutes: 3,
    image: img(36704138), imageAlt: 'An extreme close-up of a human eye with macro texture',
    imageDescription: 'A macro lens captures the intricate golden-brown striations of a human iris surrounding an expanding pupil. The eye is our primary portal of consciousness — a spotlight that dictates what part of the universe gets to exist in our mind.',
    description: 'Attention is our only non-renewable asset. In an economy engineered to harvest and trade human focus, choosing what to notice has transformed into an urgent moral act.',
    keyPoints: [
      'Simone Weil declared: "Attention, taken to its highest degree, is the same thing as prayer."',
      'Modern algorithms optimize for outrage because visceral negative emotion delivers maximum user dwell time.',
      'Attentional residue from task-switching cripples deep creative synthesis for up to 23 minutes.',
      'What you repeatedly pay attention to eventually solidifies into the architecture of your character.',
    ],
    deepDive: [
      { heading: 'The Commodification of Human Gaze', body: 'Never in history has human gaze been traded on real-time bidding exchanges. Thousands of software engineers work continuously to hijack our dopamine orienting reflex.' },
      { heading: 'Simone Weil and Moral Attention', body: 'The philosopher Simone Weil argued that to truly look at another human being without projecting one’s own ego is the purest moral act. Attention is love in its practical, daily form.' },
    ],
    stickyNotes: [
      { tag: 'The Core Truth', title: 'Attention = Life', body: 'Your life is not the passage of calendar days; it is the sum total of what you actually paid attention to.', color: 'rose', rotate: -2 },
      { tag: 'The Battle', title: 'Traded for Pennies', body: 'Remind them: if you don’t direct your attention, an ad-tech server in California will direct it for you.', color: 'yellow', rotate: 2 },
    ],
    cinematicVoiceStory: 'Look into the human eye. Behind that lens lies the most scarce, precious resource on Earth: human attention. Every corporation, politician, and notification is in an arms race to hijack your gaze. Why? Because where your attention goes, your life follows. If you attend to rage, you become bitter. If you attend to beauty, you build grace. Attention is not merely a tool for work; it is the ultimate moral act of existence.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The High-Stakes Opening', scriptPrompt: 'State clearly: "Your attention is the only thing you truly own in this life."', cue: 'Gripping, direct opening.' },
      { time: '0:15 - 0:30', phase: 'The Industrial Scale', scriptPrompt: 'Explain how billion-dollar algorithms mine our outrage for profit.', cue: 'Sharp, crisp articulation.' },
      { time: '0:30 - 0:45', phase: 'The Philosophical Depth', scriptPrompt: 'Quote Simone Weil on attention as the purest generosity.', cue: 'Lyrical and profound.' },
      { time: '0:45 - 1:00', phase: 'The Actionable Manifesto', scriptPrompt: 'Conclude: "Reclaim your eyes. Because where you look is where you live."', cue: 'Strong, resolute closing.' },
    ],
    vocalTechnique: {
      tone: 'Passionate, urgent, incisive, and commanding.',
      tempo: '125 wpm — steady and relentless.',
      powerPause: 'Pause before "Where you look is where you live".',
      advice: 'Channel righteous clarity without sounding preachy.',
    },
    facts: [
      'University of California Irvine research found it takes 23 minutes and 15 seconds to recover focus after an interruption.',
      'The average smartphone user checks their device between 96 and 150 times per day.',
    ],
    questions: ['What has your attention today, and did you choose it?', 'Can attention be a form of love?', 'What deserves more of your notice?'],
    vocabulary: ['attentional residue', 'salience', 'commodification', 'orienting reflex', 'intentionality'],
  },
  {
    id: 'p5', title: 'Is Failure Necessary?', subtitle: 'On the uses of getting it wrong',
    category: 'philosophy', difficulty: 'Gentle', minutes: 2,
    image: img(8901260), imageAlt: 'Hands examining cracked ceramic tiles, echoing kintsugi',
    imageDescription: 'Artisanal hands carefully piece together jagged ceramic shards with golden lacquer. The visual homage to kintsugi demonstrates that fracture lines, when embraced with skill, create stronger and more profound beauty than unbroken porcelain.',
    description: 'We plaster slogans about failure across tech campuses while quietly punishing it in our careers. Real failure is painful, messy, and useful only under one strict condition: honest post-mortem reflection.',
    keyPoints: [
      'Kintsugi philosophy: the fracture history is celebrated with gold resin, not concealed.',
      'Cognitive error-driven updating builds stronger neural pathways than passive rote mastery.',
      'Survivorship bias distorts failure: winners only praise past mistakes after victory guarantees safety.',
      'Organizations that stigmatize failure do not eliminate failure — they merely force it underground.',
    ],
    deepDive: [
      { heading: 'The Neurobiology of Prediction Errors', body: 'The brain learns via dopamine prediction errors. When an outcome matches expectations, little learning occurs. But when an expectation collapses catastrophically, the brain undergoes rapid synaptic remodeling.' },
      { heading: 'The Kintsugi Paradigm', body: 'When 15th-century Japanese craftsmen repaired broken pottery with gold lacquer, they created a metaphor for human resilience: the repaired vessel is more resilient and storied than pristine unblemished clay.' },
    ],
    stickyNotes: [
      { tag: 'The Golden Rule', title: 'Kintsugi Truth', body: 'A scar with reflection is wisdom. A scar without reflection is just tissue damage.', color: 'yellow', rotate: 2 },
      { tag: 'Myth Buster', title: 'Survivorship Bias', body: 'Beware billionaire advice: they tell romantic failure stories because they already survived.', color: 'rose', rotate: -1 },
    ],
    cinematicVoiceStory: 'In 15th-century Japan, when a cherished tea bowl shattered, masters did not toss it away. They bound the broken pieces with lacquer dusted in pure gold powder. The fracture did not ruin the vessel; it crowned it. Today we worship flawless success, pretending our mistakes never happened. But the truth is simple: smooth seas never built a skilled navigator. It is the broken and mended places where human wisdom actually lives.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Honest Truth', scriptPrompt: 'Admit that failure feels terrible and nobody actually enjoys it.', cue: 'Empathetic and realistic.' },
      { time: '0:15 - 0:35', phase: 'The Kintsugi Story', scriptPrompt: 'Paint the image of golden lacquer repairing broken Japanese ceramics.', cue: 'Storyteller mode, visual descriptions.' },
      { time: '0:35 - 0:48', phase: 'The Scientific Rule', scriptPrompt: 'Explain how the brain only upgrades when expectations get shattered.', cue: 'Confident and educational.' },
      { time: '0:48 - 1:00', phase: 'The Final Takeaway', scriptPrompt: 'End with: "Don\u2019t hide your cracks. Fill them with the gold of what you learned."', cue: 'Warm, inspiring climax.' },
    ],
    vocalTechnique: {
      tone: 'Inspiring, grounding, warm, and authentic.',
      tempo: '120 wpm with steady pacing.',
      powerPause: 'Leave a beat after "nobody actually enjoys failure".',
      advice: 'Speak from genuine personal experience rather than academic distance.',
    },
    facts: [
      'Kintsugi emerged when Shogun Ashikaga Yoshimasa sent a damaged Chinese tea bowl back for repair.',
      'Aviation black-box post-mortems cut commercial flight fatality rates by 99% over 50 years.',
    ],
    questions: ['What did a failure actually teach you?', 'Is "fail fast" honest advice?', 'How should we treat other people\u2019s failures?'],
    vocabulary: ['kintsugi', 'prediction error', 'survivorship bias', 'synaptic remodeling'],
  },

  /* ---------------- SCIENCE ---------------- */
  {
    id: 's1', title: 'The Colour of Sound', subtitle: 'Synesthesia and blended senses',
    category: 'science', difficulty: 'Moderate', minutes: 3,
    image: img(17327110), imageAlt: 'Colorful abstract light trails in kinetic motion',
    imageDescription: 'Ribbons of kinetic magenta, azure, and gold light streak across deep velvet darkness. The visual captures the cross-modal hallucination of synesthesia, where an auditory C-sharp ignites a burst of neon across the inner visual field.',
    description: 'Imagine hearing a violin and tasting honey, or reading the letter B and seeing crimson. Synesthesia demonstrates that our five clean sensory categories are convenient neurological fictions.',
    keyPoints: [
      'Around 1 in 25 people possess cross-wired neurological pathways that merge sensory modalities.',
      'Synesthesia runs genetically and involves reduced synaptic pruning in early sensory cortex development.',
      'Composers like Franz Liszt and Olivier Messiaen used synesthetic chords to paint visual soundscapes.',
      'The "Bouba/Kiki effect" proves that all human brains share latent cross-sensory associations.',
    ],
    deepDive: [
      { heading: 'The Cross-Wired Cortex', body: 'In neonatal infants, sensory regions in the brain are densely hyperconnected. For most humans, synaptic pruning trims these bridges. In synesthetes, rich structural highways remain between the auditory cortex and visual area V4.' },
      { heading: 'The Bouba/Kiki Experiment', body: 'When shown a sharp jagged shape and a round bulbous shape, 95% of people across every language agree: the sharp shape is "Kiki" and the round one is "Bouba". Our brains naturally map sound sharpness to visual geometry.' },
    ],
    stickyNotes: [
      { tag: 'Sensory Mashup', title: 'The Bouba/Kiki Test', body: 'Use the Bouba/Kiki test live in your talk — it immediately proves everyone has mild synesthesia.', color: 'blue', rotate: -2 },
      { tag: 'Composer Fact', title: 'Liszt in Weimar', body: 'Liszt told his orchestra: "A little bluer, gentlemen! This key requires it!"', color: 'yellow', rotate: 2 },
    ],
    cinematicVoiceStory: 'Close your eyes. When a cellist draws a bow across a heavy D-string, what happens? For most of us, we hear acoustic vibration. But for a synesthete, the room explodes in deep amber and burnt cedar. For them, Tuesday is sky-blue, the number seven smells like rain, and a trumpet tastes like fresh brass. Synesthesia is not a disorder; it is a secret backstage pass into how the brain constructs reality from raw sensory code.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Sensory Shock', scriptPrompt: 'Ask: "What if you could literally taste a cello or see the color of the letter five?"', cue: 'Playful, curious opening tone.' },
      { time: '0:15 - 0:32', phase: 'The Biology of the Bridges', scriptPrompt: 'Explain how unpruned neural bridges connect sound and color in the brain.', cue: 'Precise scientific breakdown.' },
      { time: '0:32 - 0:48', phase: 'The Universal Secret', scriptPrompt: 'Mention the Bouba/Kiki effect to show everyone is cross-wired.', cue: 'Interactive storytelling.' },
      { time: '0:48 - 1:00', phase: 'The Epistemological Punchline', scriptPrompt: 'End with: "Reality is not what\u2019s outside; it\u2019s the symphony your brain invents."', cue: 'Wonder-filled, poetic finish.' },
    ],
    vocalTechnique: {
      tone: 'Vivid, imaginative, scientifically sharp, and poetic.',
      tempo: '125 wpm with expressive tonal peaks on color words.',
      powerPause: 'Pause before "Reality is not what\u2019s outside".',
      advice: 'Paint pictures with your adjectives — let your voice sound colorful.',
    },
    facts: [
      'Vladimir Nabokov, Jimi Hendrix, and Billie Eilish have all openly discussed their synesthesia.',
      'Grapheme-color synesthesia (seeing numbers/letters in color) is the most common form.',
    ],
    questions: ['What color is the number seven to you?', 'Are your senses truly separate?', 'How much of reality is invented by the brain?'],
    vocabulary: ['synesthesia', 'cross-modal', 'Bouba/Kiki', 'V4 cortex', 'synaptic pruning'],
  },
  {
    id: 's2', title: 'Ice Cores and Ancient Air', subtitle: 'Reading the climate archive',
    category: 'science', difficulty: 'Bold', minutes: 3,
    image: img(13314282), imageAlt: 'A blue iceberg with intricate textures floating in cold waters',
    imageDescription: 'Towering cathedral walls of sapphire Antarctic ice float in frigid seas. Each crystalline layer holds microscopic air bubbles sealed shut when woolly mammoths walked the Earth — a pristine physical library of past planetary atmosphere.',
    description: 'Kilometres beneath the Antarctic ice sheet lie tiny air bubbles trapped under compression for 800,000 years. Drilling into that ice gives humanity a physical time machine with no room for dispute.',
    keyPoints: [
      'Annual snowfall compresses into distinct ice strata, preserving atmospheric bubbles intact.',
      'Ice core records prove atmospheric CO₂ cycled between 180 and 280 ppm for nearly a million years.',
      'Modern levels exceeding 420 ppm shatter the natural geological ceiling within a single century.',
      'Volcanic ash trapped in ice layers provides precise chronological bookmarks for planetary history.',
    ],
    deepDive: [
      { heading: 'The Physical Time Capsule', body: 'When snow falls in Antarctica, it traps ambient air in its porous crystals. As new snow falls, the layers compress into firn, and eventually into solid ice. Those bubbles are not computer models or proxies; they are direct physical samples of ancient Earth atmosphere.' },
      { heading: 'The EPICA Dome C Breakthrough', body: 'The European Project for Ice Coring in Antarctica drilled 3,270 metres into the ice, recovering an unbroken 800,000-year climatic record spanning eight full glacial cycles.' },
    ],
    stickyNotes: [
      { tag: 'The Time Machine', title: 'Real Ancient Air', body: 'Emphasize: scientists aren’t guessing. They are literally releasing and smelling 800,000-year-old atmosphere.', color: 'blue', rotate: -2 },
      { tag: 'The Unbroken Record', title: 'The 280 PPM Ceiling', body: 'For 8,000 centuries, CO2 never passed 280 ppm. Today it’s 425 ppm. The ice proves this is unprecedented.', color: 'amber', rotate: 2 },
    ],
    cinematicVoiceStory: 'Imagine standing on the desolate Antarctic plateau at minus fifty degrees. Scientists lower a diamond drill three kilometres into the ancient ice sheet. When they pull up the core, they are holding a glass-like cylinder filled with microscopic bubbles. Those bubbles were trapped when our ancestors were first discovering fire. When you melt that ice in a vacuum, you hear the faint pop of air from eight hundred thousand years ago. The ice does not lie, it does not argue, and it does not forget.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Physical Image', scriptPrompt: 'Describe holding a cylinder of 800,000-year-old ice with trapped bubbles.', cue: 'Cinematic, crisp opening.' },
      { time: '0:15 - 0:32', phase: 'The Scientific Mechanism', scriptPrompt: 'Explain how snowfall layers act like tree rings for Earth\u2019s atmosphere.', cue: 'Clear, authoritative cadence.' },
      { time: '0:32 - 0:48', phase: 'The 800,000-Year Proof', scriptPrompt: 'State the 180-280 ppm baseline and contrast it with today\u2019s 425 ppm.', cue: 'Deliver the statistics with undeniable weight.' },
      { time: '0:48 - 1:00', phase: 'The Moral Conclusion', scriptPrompt: 'Finish: "The ice has kept our planet\u2019s diary. The only question is if we will read it."', cue: 'Grave, memorable closing tone.' },
    ],
    vocalTechnique: {
      tone: 'Grounded, authoritative, awe-inspiring, and dramatic.',
      tempo: '115 wpm with careful enunciation of numbers and geological terms.',
      powerPause: 'Take a solid breath before the 425 ppm statistic.',
      advice: 'Avoid sounding political; let the raw physical ice speak for itself.',
    },
    facts: [
      'The Vostok ice core in East Antarctica reached a depth of 3,623 metres.',
      'Isotope ratios of oxygen (O-18 vs O-16) inside the ice reveal the exact ocean temperature when that snow fell.',
    ],
    questions: ['What surprises you most about ancient air?', 'How should evidence change behaviour?', 'Why do we trust ice more than memory?'],
    vocabulary: ['paleoclimate', 'stratification', 'EPICA', 'parts per million', 'isotopic proxy'],
  },
  {
    id: 's3', title: 'Why the Sky Is Blue', subtitle: 'An ordinary miracle, explained',
    category: 'science', difficulty: 'Gentle', minutes: 2,
    image: img(12181103), imageAlt: 'White fluffy clouds across a vivid blue sky',
    imageDescription: 'Brilliant azure sky punctuated by drifting cumulus clouds in golden afternoon sunlight. The universal canvas above our heads is an optical dance between photon wavelengths and atmospheric nitrogen molecules.',
    description: 'The most familiar visual phenomenon on Earth has a precise physical explanation. Knowing the science of Rayleigh scattering does not diminish its beauty — it deepens it into poetry.',
    keyPoints: [
      'Rayleigh scattering: shorter blue wavelengths scatter 10x more strongly off nitrogen than long red waves.',
      'Sunsets glow red because low-angle sunlight traverses 10x more atmosphere, scattering away all blue light.',
      'On Mars, airborne fine iron dust scatters red light at noon and paints sunsets an ethereal blue.',
      'Richard Feynman argued that scientific understanding adds layers of wonder to ordinary beauty.',
    ],
    deepDive: [
      { heading: 'The Mechanics of Scattering', body: 'Sunlight appears white because it contains all visible frequencies. When this light strikes nitrogen and oxygen molecules smaller than its wavelength, the shorter wavelengths (blue and violet) bounce in every direction, filling our vision with blue.' },
      { heading: 'The Martian Inverse', body: 'Mars has a thin carbon dioxide atmosphere saturated with fine magnetite dust. During the day, the Martian sky glows butterscotch-brown, while the sun sets in a halo of cold electric blue — the exact mirror of Earth.' },
    ],
    stickyNotes: [
      { tag: 'Easy Hook', title: 'The Child’s Question', body: 'Every child asks "Why is the sky blue?" Most adults can’t answer. Start by answering it in 15 seconds.', color: 'yellow', rotate: 2 },
      { tag: 'Martian Twist', title: 'Blue Martian Sunsets', body: 'Blow their minds: on Mars, daytime is butterscotch and sunsets are neon blue!', color: 'rose', rotate: -2 },
    ],
    cinematicVoiceStory: 'Every morning you step outside, look up, and see an azure ceiling. But space is pitch black. Why is our sky blue? Sunlight arrives as a pure white beam containing every color of the rainbow. When that beam strikes nitrogen molecules in our air, the short, hyperactive blue waves shatter and bounce like millions of tiny mirrors. At sunset, the light must travel through thicker air, stripping the blue away and leaving only fiery reds. Science does not rob the world of magic; it reveals the magic was physics all along.',
    speechBlueprint: [
      { time: '0:00 - 0:12', phase: 'The Everyday Wonder', scriptPrompt: 'Ask why space is black while our daytime sky glows radiant blue.', cue: 'Bright, curious opening.' },
      { time: '0:12 - 0:30', phase: 'The Rayleigh Explanation', scriptPrompt: 'Break down white light hitting nitrogen like pinballs.', cue: 'Use clear, energetic gestures.' },
      { time: '0:30 - 0:45', phase: 'The Sunset Twist', scriptPrompt: 'Explain why sunsets turn red and mention blue Martian sunsets.', cue: 'Add excitement and wonder.' },
      { time: '0:45 - 1:00', phase: 'The Feynman Philosophy', scriptPrompt: 'Conclude: "Understanding the physics of the sky doesn\u2019t take away the wonder — it makes it infinite."', cue: 'Warm, uplifting close.' },
    ],
    vocalTechnique: {
      tone: 'Enthusiastic, clear, pedagogical, and inspiring.',
      tempo: '125 wpm with lively cadence.',
      powerPause: 'Pause before mentioning Mars to let the contrast land.',
      advice: 'Speak like you are telling an exciting secret to a friend.',
    },
    facts: [
      'Our eyes are actually more sensitive to green and blue than violet, which is why we perceive the sky as blue rather than violet.',
      'Lord Rayleigh mathematically proved this scattering principle in 1871.',
    ],
    questions: ['Does explanation reduce wonder?', 'What everyday thing have you never questioned?', 'How would you explain this to a child?'],
    vocabulary: ['Rayleigh scattering', 'wavelength', 'spectrometry', 'refraction', 'photons'],
  },
  {
    id: 's4', title: 'Sleep, the Unknown Third', subtitle: 'A third of life, still mysterious',
    category: 'science', difficulty: 'Moderate', minutes: 3,
    image: img(6943421), imageAlt: 'A person asleep in a warm, softly lit room',
    imageDescription: 'A human form resting peacefully beneath warm linen in amber lamplight. The image captures the mysterious vulnerability of slumber — a nightly shutdown where the brain conducts radical metabolic surgery.',
    description: 'We surrender a third of our lives to unconsciousness. If sleep did not serve an absolute biological imperative, it would be evolution\u2019s greatest mistake.',
    keyPoints: [
      'The glymphatic system pumps cerebrospinal fluid through brain tissue to wash away beta-amyloid plaques during sleep.',
      'During REM sleep, emotional memories are stripped of their traumatic charge via noradrenaline suppression.',
      'Every biological organism ever studied sleeps, despite the lethal vulnerability it creates in the wild.',
      'Chronic short sleep of under 6 hours degrades executive function equivalent to a 0.08% blood alcohol level.',
    ],
    deepDive: [
      { heading: 'The Nightly Brain Wash', body: 'Discovered only in 2012, the glymphatic system expands glial cells by 60% during deep slow-wave sleep, allowing cerebrospinal fluid to power-flush metabolic waste accumulated during waking cognition.' },
      { heading: 'Sleep as Overnight Therapy', body: 'Matthew Walker’s research demonstrates that REM sleep is the only time the brain is completely free of noradrenaline (stress neurochemical). It replays painful memories in a safe neurochemical bath, filing them away without the panic.' },
    ],
    stickyNotes: [
      { tag: 'Brain Wash', title: 'The Glymphatic Flush', body: 'Use the visual: your brain literally power-washes itself in cerebrospinal fluid every night.', color: 'sage', rotate: -1 },
      { tag: 'Dangerous Myth', title: 'The 5-Hour Hustle', body: 'Remind them: sleeping 5 hours makes your decision-making identical to being legally drunk.', color: 'rose', rotate: 2 },
    ],
    cinematicVoiceStory: 'Tonight, eight billion human beings will lay their heads down and vanish into darkness for eight hours. In the wild, being unconscious makes you easy prey for predators. Why did evolution preserve such an insane risk? Because during deep sleep, your brain opens microscopic floodgates. Cerebrospinal fluid rushes through your synapses, washing away toxic proteins and consolidating everything you learned today into permanent memory. Sleep is not lost time; it is the price of keeping a conscious mind.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Evolutionary Mystery', scriptPrompt: 'Ask why evolution kept a behavior that makes every animal helpless for 8 hours.', cue: 'Suspenseful, dramatic tone.' },
      { time: '0:15 - 0:32', phase: 'The Glymphatic Discovery', scriptPrompt: 'Explain the brain\u2019s nighttime power-wash that clears toxic plaques.', cue: 'Fascinating scientific revelation.' },
      { time: '0:32 - 0:48', phase: 'The Memory Filing', scriptPrompt: 'Describe how dreams defang emotional trauma and cement memory.', cue: 'Empathetic and insightful.' },
      { time: '0:48 - 1:00', phase: 'The Modern Warning', scriptPrompt: 'Close with: "Sleep is not a luxury you earn when work is done; it is the biological foundation of everything you are."', cue: 'Firm, resonant conviction.' },
    ],
    vocalTechnique: {
      tone: 'Compelling, scientific, restorative, and persuasive.',
      tempo: '120 wpm — steady and authoritative.',
      powerPause: 'Pause before "Sleep is not a luxury".',
      advice: 'Speak with authority to combat the common "I\u2019ll sleep when I\u2019m dead" hustle myth.',
    },
    facts: [
      'Dolphins sleep with one hemisphere of their brain at a time (unihemispheric sleep) so they can still swim and breathe.',
      'Rats completely deprived of sleep die faster than rats deprived of food.',
    ],
    questions: ['What is your relationship with sleep?', 'Why do we treat rest as optional?', 'What do dreams do?'],
    vocabulary: ['glymphatic system', 'REM sleep', 'beta-amyloid', 'consolidation', 'unihemispheric'],
  },
  {
    id: 's5', title: 'The Placebo Effect', subtitle: 'When belief becomes biology',
    category: 'science', difficulty: 'Bold', minutes: 3,
    image: img(9742804), imageAlt: 'A row of clean medicine capsules on a surface',
    imageDescription: 'A stark, clinical row of colored medicine capsules under sterile studio lighting. The image symbolizes the blurry boundary between pharmacological chemistry and the immense neurochemical machinery of human expectation.',
    description: 'An inert sugar pill can shrink ulcers, lower blood pressure, and release real endorphins. Expectation is not an illusion; it is an active neurochemical pathway.',
    keyPoints: [
      'Placebos trigger real endogenous endorphin and dopamine cascades in the prefrontal cortex and spine.',
      'The "nocebo effect" shows that warning patients of imaginary side effects can physically trigger them.',
      'Branded, expensive, and injectable placebos outperform cheap, plain sugar pills.',
      'Open-label placebos continue to deliver measurable clinical relief even when patients are told the pill is sugar.',
    ],
    deepDive: [
      { heading: 'The Endorphin Chemistry of Expectation', body: 'When patients receive a placebo painkiller, PET scans show their brains releasing endogenous opioids. If you secretly administer naloxone (an opioid blocker), the placebo pain relief instantly vanishes — proving the effect is biologically physical.' },
      { heading: 'The Theatre of Medicine', body: 'Two sugar pills beat one sugar pill. A fake injection beats a fake pill. A fake surgery with sham incisions beats an injection. The ritual, the white coat, and the social transaction are active therapeutic ingredients.' },
    ],
    stickyNotes: [
      { tag: 'Mind Over Matter', title: 'The Naloxone Proof', body: 'Give the killer proof: if you block endorphins with naloxone, the placebo stops working! It is pure chemistry.', color: 'amber', rotate: -2 },
      { tag: 'The Theatre', title: 'Ritual as Medicine', body: 'Fake surgery works better than fake pills. We heal through meaning and ceremony.', color: 'rose', rotate: 2 },
    ],
    cinematicVoiceStory: 'A doctor hands a patient in severe pain a white capsule. Within twenty minutes, the pain recedes and their heart rate steadies. But the capsule contained nothing but inert sugar. This is the placebo effect, and it is not an imaginary trick. When your brain believes relief is coming, it manufactures its own endogenous painkillers. The placebo effect proves that human expectation is not just a thought — it is a biological pharmacy.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Dramatic Case', scriptPrompt: 'Tell the story of a sugar pill relieving real post-surgical pain.', cue: 'Intriguing, narrative start.' },
      { time: '0:15 - 0:32', phase: 'The Naloxone Evidence', scriptPrompt: 'Explain how scientists proved placebos trigger real endorphins in the spinal cord.', cue: 'Sharp scientific proof.' },
      { time: '0:32 - 0:48', phase: 'The Ritual Element', scriptPrompt: 'Mention that fake surgery works better than fake pills due to medical ceremony.', cue: 'Fascinating cultural insight.' },
      { time: '0:48 - 1:00', phase: 'The Profound Punchline', scriptPrompt: 'Conclude: "The placebo effect reveals the greatest secret of medicine: your mind is an active participant in your healing."', cue: 'Profound, commanding finale.' },
    ],
    vocalTechnique: {
      tone: 'Analytical, dramatic, inquisitive, and startling.',
      tempo: '120 wpm with crisp emphasis on medical terms.',
      powerPause: 'Pause right after "nothing but inert sugar".',
      advice: 'Deliver the naloxone evidence with punchy certainty.',
    },
    facts: [
      'In Germany, red placebo pills work better as stimulants while blue placebo pills work better as sedatives.',
      'A 2002 study in the New England Journal of Medicine showed sham arthroscopic knee surgery was as effective as real surgery.',
    ],
    questions: ['Where does belief end and biology begin?', 'Is deception ever ethical in medicine?', 'How much of your experience is expectation?'],
    vocabulary: ['endogenous opioids', 'nocebo', 'open-label placebo', 'naloxone', 'psychoneuroimmunology'],
  },

  /* ---------------- ART & CULTURE ---------------- */
  {
    id: 'a1', title: 'The Unfinished Work', subtitle: 'Why incompletion moves us',
    category: 'art', difficulty: 'Moderate', minutes: 2,
    image: img(13901052), imageAlt: 'A marble sculpture set against autumn foliage',
    imageDescription: 'A classical marble statue half-emerged from rough, chiseled stone under autumn leaves. The uncarved bedrock frames the delicate human contours, visually immortalizing the struggle of creation frozen mid-stride.',
    description: 'Michelangelo\u2019s unfinished Slaves writhe inside raw quarried marble. Schubert\u2019s Unfinished Symphony remains his most performed masterpiece. An incomplete creation invites the viewer to become an active co-creator.',
    keyPoints: [
      'The "non-finito" aesthetic in Renaissance sculpture celebrates the raw act of emergence over polished finality.',
      'The psychological Zeigarnik effect proves human memory retains unresolved narratives far longer than concluded ones.',
      'Japanese wabi-sabi philosophy identifies imperfection and asymmetry as the truest expressions of nature.',
      'A completed masterpiece demands admiration; an unfinished masterpiece demands participation.',
    ],
    deepDive: [
      { heading: 'Michelangelo and Non-Finito', body: 'Michelangelo believed the sculpture was already trapped inside the marble, and his job was merely to chisel away the excess. Leaving figures half-buried in stone turned the work into a timeless allegory of the human spirit struggling against material flesh.' },
      { heading: 'The Zeigarnik Effect in Art', body: 'In 1927, psychologist Bluma Zeigarnik observed waiters remembering complex unpaid orders perfectly, only to forget them the moment the bill was settled. Our minds crave closure; when art denies it, the artwork lives permanently in our subconscious.' },
    ],
    stickyNotes: [
      { tag: 'Michelangelo', title: 'Trapped in Stone', body: 'The genius of non-finito: we see the artist’s sweat and the figure’s desperate struggle simultaneously.', color: 'rose', rotate: -2 },
      { tag: 'Brain Hook', title: 'The Open Loop', body: 'Complete art closes a door. Unfinished art leaves a window open for your imagination.', color: 'yellow', rotate: 2 },
    ],
    cinematicVoiceStory: 'In Florence, stand before Michelangelo’s unfinished sculptures. You do not see a polished statue on a pedestal; you see a muscular human form frantically clawing its way out of raw rock. The hammer marks are still visible. Schubert died leaving his Eighth Symphony incomplete, yet it is one of the most played pieces in history. Why? Because a finished work is a monologue, but an unfinished work is an open invitation for your imagination to finish the masterpiece.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Florence Vision', scriptPrompt: 'Describe standing before Michelangelo\u2019s half-carved statues.', cue: 'Evocative, visual opening.' },
      { time: '0:15 - 0:32', phase: 'The Non-Finito Concept', scriptPrompt: 'Explain why raw hammer marks carry more emotional power than polished marble.', cue: 'Storytelling passion.' },
      { time: '0:32 - 0:48', phase: 'The Psychology of Closure', scriptPrompt: 'Introduce the Zeigarnik effect and why unfinished stories haunt us.', cue: 'Insightful and analytical.' },
      { time: '0:48 - 1:00', phase: 'The Artistic Lesson', scriptPrompt: 'End with: "Perfection closes the book. Incompletion leaves the story alive forever."', cue: 'Poetic, deliberate close.' },
    ],
    vocalTechnique: {
      tone: 'Reflective, artistic, evocative, and passionate.',
      tempo: '115 wpm with dramatic pauses on artistic terms.',
      powerPause: 'Pause before "raw invitation for your imagination".',
      advice: 'Let your voice convey reverence for artistic struggle.',
    },
    facts: [
      'Leonardo da Vinci abandoned the Adoration of the Magi in 1482 when he left for Milan.',
      'Giacomo Puccini died before finishing Turandot; at the premiere, conductor Toscanini laid down his baton mid-act and said, "Here the Maestro laid down his pen."',
    ],
    questions: ['What unfinished thing haunts you?', 'Is perfection overrated?', 'When should you stop working on something?'],
    vocabulary: ['non-finito', 'wabi-sabi', 'Zeigarnik effect', 'aesthetic tension', 'allegory'],
  },
  {
    id: 'a2', title: 'Music Without Words', subtitle: 'How sound carries emotion',
    category: 'art', difficulty: 'Gentle', minutes: 2,
    image: img(12279545), imageAlt: 'A violinist performing in a live classical orchestra',
    imageDescription: 'A soloist with violin tucked beneath chin, bow blurred mid-stroke under amber stage lights. The image conveys the physical transmission of pure acoustic frequency into visceral human emotion.',
    description: 'An instrumental cello suite can reduce a crowded concert hall to tears without uttering a single syllable. Instrumental music bypasses rational linguistic filters to speak directly to our primal limbic system.',
    keyPoints: [
      'Musical frisson (goosebumps) correlates with dopamine spikes in the nucleus accumbens during delayed harmonic resolution.',
      'Minor chords invoke universal melancholy by mimicking the acoustic frequencies of human mourning vocalizations.',
      'Musical tension functions like a storytelling arc: establishing expectation, delaying gratification, and delivering catharsis.',
      'Music activates motor planning cortex even when the listener remains in absolute physical stillness.',
    ],
    deepDive: [
      { heading: 'The Biology of the Frisson', body: 'When a symphony delays an expected chord resolution, the brain anticipates the cadence. When that resolution finally strikes, dopamine surges through the striatum — the exact reward circuitry activated by food and shelter.' },
      { heading: 'The Evolutionary Acoustic Mirror', body: 'Linguistic research shows that sad musical modes (minor thirds) mirror the downward acoustic pitch contours of human sobbing and sadness across virtually all global cultures.' },
    ],
    stickyNotes: [
      { tag: 'Goosebumps', title: 'The Frisson Wave', body: 'Musical goosebumps happen when a composer delays what your brain expects, then gives it back.', color: 'blue', rotate: 2 },
      { tag: 'Brain Secret', title: 'Older Than Words', body: 'Before humans invented grammar, our ancestors communicated emotion through pitch contours.', color: 'yellow', rotate: -1 },
    ],
    cinematicVoiceStory: 'Think of your favorite piece of instrumental music. No lyrics, no explanation, no words. Yet within twenty bars, you feel an ache in your chest or a shiver down your spine. How does vibrating wood and catgut convey tragedy better than a 500-page novel? Because language must travel through your rational prefrontal cortex. Music bypasses that gatekeeper entirely and strikes your ancient limbic brain directly. Music is what feelings sound like when words run out.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Direct Question', scriptPrompt: 'Ask how sound vibrations can make someone cry without saying a single word.', cue: 'Engaging, emotional opening.' },
      { time: '0:15 - 0:32', phase: 'The Dopamine Mechanism', scriptPrompt: 'Explain musical tension, delayed resolution, and the physical frisson.', cue: 'Excited, clear delivery.' },
      { time: '0:32 - 0:48', phase: 'The Ancient Vocal Mirror', scriptPrompt: 'Explain how minor keys mirror the acoustic pitch of human sadness.', cue: 'Deep, empathetic tone.' },
      { time: '0:48 - 1:00', phase: 'The Timeless Truth', scriptPrompt: 'Conclude: "Music is not sound decoration; it is the universal language we spoke before words existed."', cue: 'Lyrical, sweeping conclusion.' },
    ],
    vocalTechnique: {
      tone: 'Warm, lyrical, emotive, and expressive.',
      tempo: '120 wpm with melodic variation in your pitch.',
      powerPause: 'Take a soft breath before the final concluding sentence.',
      advice: 'Vary the musicality of your own speaking voice.',
    },
    facts: [
      'The sensation of musical goosebumps is experienced by roughly 50% of the human population.',
      'The oldest known musical instrument is a 40,000-year-old Neanderthal vulture-bone flute found in Slovenia.',
    ],
    questions: ['Which piece of music undoes you?', 'Can sound mean something without words?', 'Why do we play sad music when sad?'],
    vocabulary: ['frisson', 'cadence', 'harmonic resolution', 'limbic system', 'nucleus accumbens'],
  },
  {
    id: 'a3', title: 'Who Decides What Is Good?', subtitle: 'Taste, gatekeepers and canon',
    category: 'art', difficulty: 'Bold', minutes: 3,
    image: img(30489756), imageAlt: 'Visitors admiring paintings in an art gallery museum',
    imageDescription: 'Museum patrons stand in contemplative silhouette before framed Renaissance oil canvases in an echoing gallery. The image illustrates how institutional curators and historical gatekeepers sanctify certain artworks as timeless masterpieces.',
    description: 'Every culture inherits a canon of "masterpieces". But aesthetic canons are not objective laws of physics — they are historical negotiations constructed by wealth, power, and curation.',
    keyPoints: [
      'Johannes Vermeer was dismissed as a minor regional painter for 200 years until 19th-century critics revived him.',
      'Pierre Bourdieu demonstrated that "good taste" functions as social currency to signal class belonging.',
      'Algorithmic curation has replaced institutional gatekeepers, optimizing for virality over craftsmanship.',
      'Canons are living arguments: true cultural vitality lies in questioning what gets excluded.',
    ],
    deepDive: [
      { heading: 'The Resurrection of Vermeer', body: 'Today Vermeer\u2019s Girl with a Pearl Earring is iconic. Yet for two centuries, his paintings fetched pennies at estate sales. It took a single French art critic, Théophile Thoré-Bürger, to re-evaluate his work and create the legend we accept today.' },
      { heading: 'Bourdieu and Cultural Capital', body: 'The sociologist Pierre Bourdieu proved that aesthetic preferences — whether for opera or reality television — are taught markers of social class, serving to separate the elite from the masses under the guise of "natural taste".' },
    ],
    stickyNotes: [
      { tag: 'History Twist', title: 'The Vermeer Lesson', body: 'Vermeer was a nobody for 200 years. Greatness is not self-evident; it requires champions.', color: 'rose', rotate: 2 },
      { tag: 'The New Judge', title: 'From Critic to Algorithm', body: 'We swapped museum curators for TikTok recommendation algorithms. Taste is now engagement.', color: 'amber', rotate: -2 },
    ],
    cinematicVoiceStory: 'Step into the Louvre or the Met. We look at the gilded frames and assume history objectively filtered the greatest works ever made. But think of Vermeer. For two centuries after his death, his masterpieces sat neglected in dusty attics. He was declared a genius only because a single French critic decided to champion him in 1866. Greatness is not an absolute law; it is a conversation between the work, the gatekeeper, and the era. The question is: who is curating your taste right now?',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Museum Assumption', scriptPrompt: 'Challenge the idea that classic masterpieces won a fair, objective contest.', cue: 'Provocative, curious opening.' },
      { time: '0:15 - 0:32', phase: 'The Vermeer Case', scriptPrompt: 'Tell the story of Vermeer being forgotten for 200 years until one critic revived him.', cue: 'Fast-paced storytelling.' },
      { time: '0:32 - 0:48', phase: 'The Modern Shift', scriptPrompt: 'Contrast aristocratic curators with modern AI feed algorithms.', cue: 'Sharp sociological critique.' },
      { time: '0:48 - 1:00', phase: 'The Personal Challenge', scriptPrompt: 'Conclude: "Never let an institution or an algorithm decide what moves you. Taste is your own kingdom."', cue: 'Empowering, strong finish.' },
    ],
    vocalTechnique: {
      tone: 'Provocative, intellectual, engaging, and skeptical.',
      tempo: '125 wpm with sharp rhetorical questions.',
      powerPause: 'Pause before "who is curating your taste right now?".',
      advice: 'Challenge the audience without being condescending.',
    },
    facts: [
      'Vincent van Gogh sold only one documented painting during his lifetime: The Red Vineyard.',
      'The word "canon" derives from the ancient Greek word for a measuring reed.',
    ],
    questions: ['Is taste personal or inherited?', 'Who curates what you see?', 'Can quality be objective?'],
    vocabulary: ['cultural capital', 'gatekeeping', 'canonization', 'Bourdieu', 'curatorial bias'],
  },

  /* ---------------- HISTORY ---------------- */
  {
    id: 'h1', title: 'Letters Never Sent', subtitle: 'The archive of unspoken things',
    category: 'history', difficulty: 'Bold', minutes: 2,
    image: img(37213006), imageAlt: 'Detailed close-up of handwritten cursive on vintage parchment',
    imageDescription: 'A yellowed manuscript letter covered in flowing sepia ink handwriting, folded and preserved away from light. The document embodies unmediated, unperformed human emotion penned in raw privacy.',
    description: 'Archives contain hundreds of letters written in incandescent fury or desperate affection that were never placed in the post. They remain the most authentic historical artefacts humanity has ever produced.',
    keyPoints: [
      'Abraham Lincoln routinely wrote blistering "hot letters" to generals, then locked them in his desk marked "Never Sent".',
      'The act of private writing discharges acute amygdala agitation without scorching interpersonal bonds.',
      'Removing the audience obliterates the performance instinct, leaving pure psychological candour.',
      'Unsent correspondence demonstrates that language serves as a tool for self-understanding, not just communication.',
    ],
    deepDive: [
      { heading: 'Lincoln\u2019s Hot Letters', body: 'After General George Meade failed to pursue Robert E. Lee after Gettysburg, Lincoln wrote a devastating rebuke accusing him of letting the Civil War drag on. Lincoln never sent it. It was discovered after his death in an envelope marked "never signed".' },
      { heading: 'Pennebaker Expressive Writing Protocol', body: 'Modern clinical psychology confirms Lincoln\u2019s intuition: writing privately about deep distress for 15 minutes reduces systemic inflammation and improves cognitive function, even if the paper is shredded immediately.' },
    ],
    stickyNotes: [
      { tag: 'Lincoln’s Trick', title: 'The Hot Letter', body: 'Write with fury at midnight. Sleep on it. File it unsent in the morning. Lincoln saved his presidency this way.', color: 'amber', rotate: -2 },
      { tag: 'Psychological Gold', title: 'Writing Without An Audience', body: 'The moment someone else reads your words, you start lying to look good. Unsent letters tell the raw truth.', color: 'rose', rotate: 2 },
    ],
    cinematicVoiceStory: 'In July 1863, after the bloody battle of Gettysburg, President Abraham Lincoln took up his pen in rage. He wrote a furious letter to his commanding general, accusing him of cowardice and catastrophic failure. Then Lincoln folded the paper, locked it in his desk drawer, and never sent it. Why? Because the writing discharged his fury, but the silence preserved the union. Some of the most powerful words ever written were meant for only one reader: the person holding the pen.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Dramatic Hook', scriptPrompt: 'Describe Lincoln writing with trembling fury after Gettysburg.', cue: 'Intense, whispered storytelling.' },
      { time: '0:15 - 0:32', phase: 'The Secret Drawer', scriptPrompt: 'Explain how the letter was found in his desk marked "Never Sent".', cue: 'Build mystery and intrigue.' },
      { time: '0:32 - 0:48', phase: 'The Psychology of Unsent Words', scriptPrompt: 'Explain how writing removes performance and heals the writer.', cue: 'Warm, psychological insight.' },
      { time: '0:48 - 1:00', phase: 'The Practical Advice', scriptPrompt: 'End with: "When anger strikes, write everything down with fire — then put it away with wisdom."', cue: 'Grounded, impactful close.' },
    ],
    vocalTechnique: {
      tone: 'Intimate, dramatic, historical, and deeply wise.',
      tempo: '115 wpm with deliberate pauses for emotional resonance.',
      powerPause: 'Take a long pause before "never sent it".',
      advice: 'Lower your pitch slightly to create an intimate atmosphere.',
    },
    facts: [
      'Mark Twain kept a drawer of unsent scathing letters addressed to critics, publishers, and politicians.',
      'Franz Kafka wrote a 47-page letter to his abusive father in 1919 that his mother refused to deliver.',
    ],
    questions: ['What would you write and never send?', 'Do words need a reader to matter?', 'Are you more honest written or spoken?'],
    vocabulary: ['epistolary', 'candour', 'unmediated', 'expressive writing', 'rhetorical restraint'],
  },
  {
    id: 'h2', title: 'Before the Clock', subtitle: 'How people once told time',
    category: 'history', difficulty: 'Moderate', minutes: 3,
    image: img(4610741), imageAlt: 'The medieval Prague astronomical clock with intricate golden dials',
    imageDescription: 'The 15th-century Prague Astronomical Clock with rotating golden astrolabe dials, zodiac symbols, and gothic allegories of mortality. The clock symbolizes the pivotal historical pivot from natural cosmic rhythms to mechanical synchronization.',
    description: 'For thousands of years, an hour was not a rigid 60-minute block. The mechanical clock did not merely measure time — it colonized human civilization and transformed living into an industrial assembly line.',
    keyPoints: [
      'Roman and medieval hours expanded in summer and shrank in winter to fit seasonal daylight.',
      'Monastic prayer bells in the 13th century introduced the first standardized public acoustic time signals.',
      'Railroad timetables in the 1840s forced towns to abolish local solar time and adopt unified Greenwich time.',
      'Clocks transformed time from a lived natural season into an economic commodity that could be bought, sold, and wasted.',
    ],
    deepDive: [
      { heading: 'The Elastic Seasonal Hour', body: 'In ancient Rome, the day was divided into 12 daylight hours and 12 night hours. In June, an hour lasted 75 modern minutes; in December, only 44. Time lived in harmony with the sun, expanding and contracting like a lung.' },
      { heading: 'Railways and the Death of Solar Noon', body: 'Until the mid-19th century, every English and American town set its town clock by the sun at noon. When railways arrived, trains collided because local times differed by 15 minutes across 100 miles. Standardized time zones were invented for locomotives, not humans.' },
    ],
    stickyNotes: [
      { tag: 'Mind Shift', title: 'The Elastic Hour', body: 'Remind them: for most of history, summer hours were literally longer than winter hours!', color: 'yellow', rotate: 2 },
      { tag: 'Industrial Shock', title: 'Invented for Trains', body: 'We don’t live by nature’s clock; we live by 19th-century railway logistics.', color: 'amber', rotate: -2 },
    ],
    cinematicVoiceStory: 'Before mechanical clocks, time was not a number on your wrist; it was the warmth of the sun on your neck. In ancient Rome, summer hours were seventy-five minutes long and winter hours were forty-four. Time breathed with the seasons. Then came monasteries, factories, and railway lines. We standardized time to keep trains from crashing, and in doing so, we turned the gift of living into a commodity to be punched on a timecard.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Roman Surprise', scriptPrompt: 'Explain how summer hours in ancient Rome were 75 minutes long.', cue: 'Surprising, engaging opening.' },
      { time: '0:15 - 0:32', phase: 'The Living Season', scriptPrompt: 'Describe how human life synced with sunrise, seasons, and church bells.', cue: 'Lyrical, pastoral storytelling.' },
      { time: '0:32 - 0:48', phase: 'The Train Revolution', scriptPrompt: 'Explain how 19th-century railways invented time zones to stop crashes.', cue: 'Energetic, historical pivot.' },
      { time: '0:48 - 1:00', phase: 'The Modern Question', scriptPrompt: 'End with: "We stopped asking what season it is, and started asking what time it is. Are we using the clock, or is the clock using us?"', cue: 'Profound philosophical challenge.' },
    ],
    vocalTechnique: {
      tone: 'Narrative, historical, rhythmic, and thought-provoking.',
      tempo: '120 wpm with ticking rhythm during the industrial transition.',
      powerPause: 'Pause before "Are we using the clock, or is the clock using us?".',
      advice: 'Use your hands to mimic the ticking and the elastic flow of time.',
    },
    facts: [
      'The Prague Astronomical Clock has been functioning since 1410.',
      'The phrase "clockwise" only exists because early northern hemisphere sundials cast shadows that rotated to the right.',
    ],
    questions: ['Do you obey the clock or use it?', 'What did we gain and lose?', 'How would a day feel without one?'],
    vocabulary: ['temporal standardisation', 'Greenwich Mean Time', 'solar noon', 'mechanical synchronization', 'industrialization'],
  },
  {
    id: 'h3', title: 'The Library of Alexandria', subtitle: 'On losing knowledge',
    category: 'history', difficulty: 'Moderate', minutes: 3,
    image: img(37542465), imageAlt: 'Historic library interior with towering wooden bookshelves',
    imageDescription: 'Multi-tiered classical library galleries reaching toward vaulted frescoed ceilings, laden with leather volumes. The image symbolizes humanity\u2019s precarious quest to preserve collective memory against time and entropy.',
    description: 'The tragedy of Alexandria is not that it burned in a single catastrophic night. It declined through budget cuts, neglect, and political apathy. That is how most human knowledge is quietly lost.',
    keyPoints: [
      'The popular myth of a single fire destroying all scrolls is false; the library degraded over centuries of civil decay.',
      'Ancient texts survived only through continuous hand-copying; once funding stopped, entire civilizations vanished from memory.',
      'Only 7 of Sophocles\u2019 123 plays survive today; the remaining 116 are lost forever.',
      'Digital formats suffer bit rot: magnetic tapes and floppy disks become unreadable in mere decades.',
    ],
    deepDive: [
      { heading: 'The Slow Attrition of Memory', body: 'Julius Caesar\u2019s fleet fire in 48 BC damaged docks, but the library continued for centuries. Its true death came from roman budget cuts, religious expulsions, and administrative neglect. Civilizations do not lose knowledge in grand explosions; they lose it when they stop paying people to care.' },
      { heading: 'The Modern Digital Dark Age', body: 'Vint Cerf, a father of the Internet, warned of a 21st-century "Digital Dark Age". Millions of websites, digital archives, and photos stored on proprietary formats from the 1990s are already permanently corrupted and lost.' },
    ],
    stickyNotes: [
      { tag: 'Myth Buster', title: 'No Single Fire', body: 'Alexandria didn’t burn in one night. It died of budget cuts and apathy across 300 years.', color: 'rose', rotate: -2 },
      { tag: 'The Modern Threat', title: 'The Digital Dark Age', body: 'Ancient stone tablets last 4,000 years. Your hard drive fails in 7 years. Which archive is safer?', color: 'yellow', rotate: 2 },
    ],
    cinematicVoiceStory: 'We all know the legend of the Library of Alexandria — half a million scrolls holding the ancient world\u2019s greatest secrets, consumed in one apocalyptic fire. But the real history is far more chilling. The library didn’t vanish in a single blaze; it died slowly from neglect, budget cuts, and indifference across three hundred years. When we stop copying and caring for our knowledge, civilizational memory quietly bleeds away. Today, as we store our history on fragile digital clouds, we must ask: are we building another Alexandria?',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Hollywood Myth', scriptPrompt: 'Deconstruct the myth of the single fire destroying Alexandria.', cue: 'Dramatic, myth-busting opening.' },
      { time: '0:15 - 0:32', phase: 'The Chilling Reality', scriptPrompt: 'Explain how budget cuts and lack of copying wiped out 116 of Sophocles\u2019 plays.', cue: 'Sobering historical facts.' },
      { time: '0:32 - 0:48', phase: 'The Digital Parallel', scriptPrompt: 'Contrast ancient papyrus with fragile hard drives that rot in 10 years.', cue: 'Urgent, modern parallel.' },
      { time: '0:48 - 1:00', phase: 'The Call to Preservation', scriptPrompt: 'End with: "Knowledge is not permanent. It survives only as long as someone cares enough to pass it on."', cue: 'Inspiring, guardian-like tone.' },
    ],
    vocalTechnique: {
      tone: 'Sober, historical, cautionary, and dramatic.',
      tempo: '115 wpm with heavy cadence on the loss of literature.',
      powerPause: 'Pause before "died slowly from neglect".',
      advice: 'Treat the loss of knowledge with the gravity of an ecological extinction.',
    },
    facts: [
      'The Library of Alexandria had a policy of confiscating every book on incoming ships, copying it, and returning the copy while keeping the original.',
      'Only 1% of ancient Greek and Roman literature has survived to the modern era.',
    ],
    questions: ['What knowledge are we quietly losing now?', 'Is digital memory durable?', 'What deserves preserving?'],
    vocabulary: ['attrition', 'papyrus', 'Digital Dark Age', 'preservation', 'historiography'],
  },

  /* ---------------- NATURE ---------------- */
  {
    id: 'n1', title: 'The Language of Trees', subtitle: 'Networks beneath the soil',
    category: 'nature', difficulty: 'Bold', minutes: 3,
    image: img(14785186), imageAlt: 'Low angle of green tall pine trees reaching toward sky with sunbeams',
    imageDescription: 'Towering cathedral pine trees framed from below, their crowns interlocking in the canopy while sunbeams pierce the green haze. Beneath the moss lies a vast fungal internet uniting the entire forest.',
    description: 'Beneath the forest floor lies the "Wood Wide Web" — a vast fungal network through which trees trade nutrients, warn neighbors of insect attacks, and nourish shaded seedlings.',
    keyPoints: [
      'Mycorrhizal fungi connect root systems across miles, trading soil minerals for tree sugars.',
      'Older "Mother Trees" channel carbon reserves to nourish shaded saplings and dying kin.',
      'Attacked by bark beetles, trees release volatile warning chemicals so neighboring trees produce tannins.',
      'A forest functions not as a battlefield of isolated competitors, but as a collaborative superorganism.',
    ],
    deepDive: [
      { heading: 'Suzanne Simard’s Mother Trees', body: 'Ecologist Suzanne Simard used radioactive carbon isotopes to trace sugar flows in forests. She proved that mature Douglas firs and paper birches trade carbon back and forth depending on who is receiving more seasonal sunlight.' },
      { heading: 'Chemical Early Warning Systems', body: 'When an aphid attacks an acacia tree, the tree emits ethylene gas into the air. Nearby acacias detect the gas within minutes and begin pumping toxic tannins into their leaves before the insects even arrive.' },
    ],
    stickyNotes: [
      { tag: 'Mother Trees', title: 'Suzanne Simard\u2019s Proof', body: 'Old trees feed young saplings through underground fungal cables. It is literal forest care.', color: 'sage', rotate: 2 },
      { tag: 'The Fungal Net', title: 'The Wood Wide Web', body: 'A single pinch of forest soil has kilometers of fungal threads routing nutrients like fiber optic cables.', color: 'amber', rotate: -2 },
    ],
    cinematicVoiceStory: 'Walk into a dense forest. You see individual oaks and firs standing apart. But look ten inches beneath your boots. Every single root is plugged into a subterranean fungal network spanning hundreds of miles. Through this "wood wide web", an old mother tree sends sugar to a shaded seedling dying in darkness. When a beetle attacks on the eastern ridge, chemical distress signals pulse through the mycelium, priming the defenses of trees miles away. The forest is not a war zone of selfish trees; it is a single, breathing superorganism.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Subterranean Reveal', scriptPrompt: 'Tell the audience that the trees around them are plugged into an underground network.', cue: 'Wonder-filled, secretive opening.' },
      { time: '0:15 - 0:32', phase: 'The Mother Tree Carbon Trade', scriptPrompt: 'Explain how old trees feed young saplings through fungal cables.', cue: 'Warm, storytelling delivery.' },
      { time: '0:32 - 0:48', phase: 'The Chemical Warning Siren', scriptPrompt: 'Describe how trees warn neighbors about beetle attacks via air and soil.', cue: 'Exciting, dramatic explanation.' },
      { time: '0:48 - 1:00', phase: 'The Ecological Lesson', scriptPrompt: 'Finish: "Nature didn\u2019t survive by cutthroat competition; it survived by radical underground connection."', cue: 'Inspiring, resonant conclusion.' },
    ],
    vocalTechnique: {
      tone: 'Wonder-filled, poetic, scientifically grounded, and expansive.',
      tempo: '120 wpm with organic pauses.',
      powerPause: 'Pause after "ten inches beneath your boots".',
      advice: 'Paint a visual picture of subterranean networks glowing with life.',
    },
    facts: [
      'A single teaspoon of healthy forest soil contains miles of microscopic fungal mycelium.',
      'Some trees pump poison through the network to suppress invasive plant species.',
    ],
    questions: ['Is cooperation as natural as competition?', 'What does a forest know?', 'Where else do we underestimate connection?'],
    vocabulary: ['mycorrhizal', 'mycelium', 'Mother Tree', 'superorganism', 'symbiosis'],
  },
  {
    id: 'n2', title: 'Light From Dead Stars', subtitle: 'Looking at the past',
    category: 'nature', difficulty: 'Moderate', minutes: 2,
    image: img(31021507), imageAlt: 'Starry night sky over a vast desert expanse',
    imageDescription: 'A crystal-clear canopy of the Milky Way arching across an obsidian desert horizon. Every pinprick of light is a photon emitted centuries or millions of years ago, turning the night sky into a live archaeological excavation.',
    description: 'Every time you glance up at the night sky, you are looking directly into the past. Some of the stars illuminating your eyes exploded into dust millennia ago.',
    keyPoints: [
      'Light travels at 300,000 km/s; looking across astronomical distances means looking across cosmic time.',
      'Light from the Andromeda Galaxy left its stars 2.5 million years ago, when early hominids were fashioning stone tools.',
      'The James Webb Space Telescope captures photons from 13.5 billion years ago, near the dawn of creation.',
      'Every heavy element in your body — the iron in your blood, calcium in bones — was forged inside a dying star.',
    ],
    deepDive: [
      { heading: 'The Sky as a Time Machine', body: 'Because the speed of light is finite, distance equals lookback time. Sunlight is 8 minutes old; light from Betelgeuse is 640 years old; light from distant nebulae left before our planet had oceans.' },
      { heading: 'Cosmic Nucleosynthesis', body: 'The Big Bang produced only hydrogen and helium. Every complex atom that makes up human cells, DNA, and smartphones was manufactured inside the nuclear furnace of a massive star that blew itself apart billions of years ago.' },
    ],
    stickyNotes: [
      { tag: 'Cosmic Truth', title: 'Stardust in Your Veins', body: 'The iron in your left hand came from a star; the iron in your right hand came from a different star.', color: 'blue', rotate: -2 },
      { tag: 'Lookback Time', title: 'Andromeda Lookback', body: 'When Andromeda’s light started traveling, humans hadn’t even discovered fire yet.', color: 'yellow', rotate: 2 },
    ],
    cinematicVoiceStory: 'Step out tonight and look up at the constellation Orion. Find the red supergiant star Betelgeuse. The light hitting your retina right now left that star over six hundred years ago, during the Middle Ages. For all we know, that star may have exploded yesterday, and we won’t find out for centuries. Telescopes are not just cameras; they are physical time machines. And the most startling truth of all? Every iron atom in your blood was forged inside the core of a dying star. We are the cosmos observing itself.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Stargazing Intro', scriptPrompt: 'Invite the audience to imagine looking up at Betelgeuse tonight.', cue: 'Intimate, wonder-filled voice.' },
      { time: '0:15 - 0:32', phase: 'The Speed of Light', scriptPrompt: 'Explain how light from Andromeda left 2.5 million years ago.', cue: 'Mind-expanding delivery.' },
      { time: '0:32 - 0:48', phase: 'The Stardust Fact', scriptPrompt: 'Deliver Carl Sagan\u2019s truth: the elements in our blood were forged in dying stars.', cue: 'Lyrical, profound reverence.' },
      { time: '0:48 - 1:00', phase: 'The Cosmic Punchline', scriptPrompt: 'Conclude: "You are not just a spectator in the universe; you are made of the very stars you look at."', cue: 'Triumphant, awe-inspiring close.' },
    ],
    vocalTechnique: {
      tone: 'Awe-inspiring, cosmic, poetic, and expansive.',
      tempo: '115 wpm with grand, sweeping pauses.',
      powerPause: 'Take a two-second pause before "We are the cosmos observing itself".',
      advice: 'Speak with cosmic reverence — let the sheer scale of space settle in the room.',
    },
    facts: [
      'Sunlight hitting your skin is 8 minutes and 20 seconds old.',
      'The Cosmic Microwave Background is the afterglow of the Big Bang, still faintly visible as static on old analog TVs.',
    ],
    questions: ['How does deep time make you feel?', 'What have we lost by losing the night sky?', 'Does scale comfort or unsettle you?'],
    vocabulary: ['lookback time', 'nucleosynthesis', 'light-year', 'supergiant', 'cosmic microwave background'],
  },
  {
    id: 'n3', title: 'The Migration Instinct', subtitle: 'Journeys without maps',
    category: 'nature', difficulty: 'Gentle', minutes: 2,
    image: img(9864849), imageAlt: 'Flock of birds flying across an evening sky',
    imageDescription: 'A migratory V-formation of birds slicing through golden twilight clouds. Guided by quantum cryptochromes in their retinas, they navigate thousands of uncharted miles with precision.',
    description: 'Arctic terns fly 70,000 kilometres from pole to pole every year. Monarch butterflies reach an ancestral grove in Mexico that their great-grandparents left. Nobody gives them a map.',
    keyPoints: [
      'Migratory birds possess quantum cryptochrome proteins in their eyes that allow them to literally see Earth\u2019s magnetic lines.',
      'Monarch butterfly migration spans four distinct generations; the butterfly arriving has never seen the destination.',
      'Bar-tailed godwits fly non-stop for 11 days across the entire Pacific Ocean without eating, drinking, or landing.',
      'Migration proves that memory and navigation can be hardcoded directly into the genome.',
    ],
    deepDive: [
      { heading: 'Quantum Biology in the Avian Eye', body: 'Birds utilize cryptochrome-4 proteins in their retinas. When blue light strikes this protein, it creates entangled radical pairs of electrons whose quantum spin states are sensitive to micro-variations in Earth\u2019s magnetic field.' },
      { heading: 'The Multigenerational Relay', body: 'The monarch butterfly that leaves Canada in August will never return. It flies to Michoacán, hibernates, mates, and dies. Three generations later, their great-grandchildren navigate back to the identical pine grove without any elder guide.' },
    ],
    stickyNotes: [
      { tag: 'The 11-Day Flight', title: 'The Godwit Miracle', body: 'The Bar-tailed Godwit flies 7,000 miles across open ocean for 11 straight days with zero rest stops.', color: 'amber', rotate: 2 },
      { tag: 'Quantum Vision', title: 'Seeing Magnetism', body: 'Birds don’t have a compass; their eyes literally perceive magnetic field lines as glowing bands of light.', color: 'blue', rotate: -2 },
    ],
    cinematicVoiceStory: 'A small bird weighing less than a coffee cup takes off from Alaska. It flies over the open Pacific Ocean, flapping its wings without stopping for eleven days and nights — no food, no water, no sleep. It lands on a tiny beach in New Zealand without drifting one mile off course. How? In its eyes are quantum proteins that let it literally see the magnetic field lines of the planet. Nature does not need GPS satellites; the compass of life was written into our biology before continents were even formed.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Impossible Flight', scriptPrompt: 'Describe a 10-ounce bird flying 11 days across the open Pacific.', cue: 'Astonished, gripping opening.' },
      { time: '0:15 - 0:32', phase: 'The Quantum Eye', scriptPrompt: 'Explain how cryptochrome proteins let birds see Earth\u2019s magnetic field.', cue: 'Cutting-edge science delivery.' },
      { time: '0:32 - 0:48', phase: 'The Generational Butterfly', scriptPrompt: 'Explain how monarch butterflies complete journeys across four generations.', cue: 'Emotional, poetic awe.' },
      { time: '0:48 - 1:00', phase: 'The Human Reflection', scriptPrompt: 'End with: "We think we are lost without our screens, but life has always known the way home."', cue: 'Warm, reassuring finish.' },
    ],
    vocalTechnique: {
      tone: 'Awe-filled, kinetic, dramatic, and inspiring.',
      tempo: '120 wpm with soaring energy.',
      powerPause: 'Pause before "no food, no water, no sleep".',
      advice: 'Use soaring vocal dynamics to match the flight of migratory birds.',
    },
    facts: [
      'An Arctic tern flies the equivalent of three round trips to the Moon over its 30-year lifetime.',
      'Migrating birds can sleep with one eye open and half their brain in sleep mode while flying at 3,000 feet.',
    ],
    questions: ['What does instinct mean?', 'Is inherited knowledge possible?', 'What journeys do we make without maps?'],
    vocabulary: ['magnetoreception', 'cryptochrome', 'Bar-tailed Godwit', 'epigenetic memory', 'transoceanic'],
  },

  /* ---------------- TECHNOLOGY ---------------- */
  {
    id: 't1', title: 'Talking to Machines', subtitle: 'Conversation without a person',
    category: 'technology', difficulty: 'Bold', minutes: 3,
    image: img(30547618), imageAlt: 'Abstract glowing digital network of connected cubes',
    imageDescription: 'Luminescent digital cubes interconnected by neon data streams pulsing in the dark. The image represents the emergence of non-human conversational intelligence capable of mirroring human linguistic syntax.',
    description: 'For the first time in human evolution, we can hold fluent, poetic conversation with an entity that is not alive. That changes the definition of conversation itself.',
    keyPoints: [
      'The 1960s ELIZA chatbot proved how readily humans project consciousness and emotional understanding onto simple scripts.',
      'Fluency is not comprehension: generating convincing probabilistic language does not equal subjective understanding.',
      'Language models act as cognitive mirrors, reflecting humanity\u2019s accumulated textual biases and wisdom.',
      'The urgent question is not whether machines understand us, but how talking to machines will reshape how we talk to humans.',
    ],
    deepDive: [
      { heading: 'The ELIZA Effect and Anthropomorphism', body: 'In 1966, MIT computer scientist Joseph Weizenbaum built ELIZA. When his secretary asked him to leave the room so she could confide in the program, Weizenbaum was terrified by how quickly human beings project emotional intimacy onto computational scripts.' },
      { heading: 'Syntax versus Semantics', body: 'Philosopher John Searle\u2019s "Chinese Room" argument reminds us that manipulating symbols with mathematical perfection does not grant understanding. A machine can craft a sonnet on heartbreak without ever feeling a single pang of sorrow.' },
    ],
    stickyNotes: [
      { tag: 'The Mirror', title: 'Cognitive Mirror', body: 'AI is not an alien mind; it is an echoing mirror of every book, tweet, and paper humanity ever wrote.', color: 'blue', rotate: 2 },
      { tag: 'Human Risk', title: 'The Atrophy Risk', body: 'If machines provide frictionless agreement, will we lose the patience to talk to complicated, messy humans?', color: 'rose', rotate: -2 },
    ],
    cinematicVoiceStory: 'For two hundred thousand years, every voice you ever heard came from a living throat — a human, an animal, or the wind. Today, you can type into a glowing box and receive poetry, empathy, and advice from an entity that has never drawn a breath. It doesn’t feel pain, it doesn’t dream, and it doesn’t love. Yet we confide in it. The real revolution of artificial intelligence is not that machines have become human; it is what they reveal about our desperate hunger to be heard.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Historical Break', scriptPrompt: 'Point out that for 200,000 years, words always belonged to living flesh.', cue: 'Dramatic, historical framing.' },
      { time: '0:15 - 0:32', phase: 'The Illusion of Empathy', scriptPrompt: 'Explain how probabilistic code mimics human intimacy without feeling anything.', cue: 'Sharp philosophical distinction.' },
      { time: '0:32 - 0:48', phase: 'The Anthropomorphic Mirror', scriptPrompt: 'Introduce the ELIZA effect and our instinct to project a soul onto code.', cue: 'Engaging, modern critique.' },
      { time: '0:48 - 1:00', phase: 'The Core Challenge', scriptPrompt: 'End with: "The danger of AI is not that machines will think like humans, but that humans will forget how to listen to one another."', cue: 'Powerful, memorable warning.' },
    ],
    vocalTechnique: {
      tone: 'Philosophical, urgent, provocative, and razor-sharp.',
      tempo: '125 wpm with crisp analytical cadence.',
      powerPause: 'Pause before "The danger of AI is not that machines will think".',
      advice: 'Avoid tech jargon; focus on the human psychological stakes.',
    },
    facts: [
      'The Turing Test was originally called the "Imitation Game" by Alan Turing in 1950.',
      'Modern LLMs calculate probabilities across hundreds of billions of numerical parameters in milliseconds.',
    ],
    questions: ['What makes conversation real?', 'Has AI changed how you think?', 'What can only a human give you?'],
    vocabulary: ['anthropomorphism', 'ELIZA effect', 'probabilistic syntax', 'Chinese Room', 'cognitive mirror'],
  },
  {
    id: 't2', title: 'The Cost of Convenience', subtitle: 'What frictionless living removes',
    category: 'technology', difficulty: 'Moderate', minutes: 3,
    image: img(19223902), imageAlt: 'A smartphone photographing a bustling city night scene',
    imageDescription: 'A hand holds a glowing smartphone framing a dazzling neon city street. The screen acts as an intermediary lens, packaging the messy sensory chaos of urban life into clean digital pixels.',
    description: 'Every app promises to eliminate friction. But friction was doing quiet evolutionary work — building patience, spatial navigation, serendipity, and human resilience.',
    keyPoints: [
      'GPS navigation apps measurably degrade hippocampus volume and mental mapping capabilities.',
      'The "IKEA effect" demonstrates that human beings value objects and skills far more when they require struggle.',
      'One-click purchasing and instant delivery decouple desire from anticipation, dampening dopamine satisfaction.',
      'Frictionless social interactions reduce tolerance for the awkward, messy compromises of real-world community.',
    ],
    deepDive: [
      { heading: 'Hippocampal Atrophy and Navigation', body: 'Studies comparing London taxi drivers (who memorize 25,000 streets for "The Knowledge") with GPS users show drivers develop larger posterior hippocampi. GPS users show progressive loss of spatial orientation.' },
      { heading: 'The Eradication of Serendipity', body: 'When algorithms predict your taste and eliminate wrong turns, they also eliminate the accidental book, the unplanned conversation with a stranger, and the joyful detour that sparks original thought.' },
    ],
    stickyNotes: [
      { tag: 'Lost Skills', title: 'The London Cabbie Proof', body: 'London cabbies have bigger brains because they memorize streets. GPS literally shrinks your spatial memory.', color: 'amber', rotate: -2 },
      { tag: 'Friction is Good', title: 'The Muscle of Waiting', body: 'Friction is the resistance that builds cognitive muscle. Zero friction means cognitive atrophy.', color: 'rose', rotate: 2 },
    ],
    cinematicVoiceStory: 'With a single swipe, dinner appears at your door. With one tap, a car arrives. With one click, your groceries are ordered. We have built a world of zero friction. But consider this: muscles only grow against resistance. When you remove all struggle — navigating without a map, cooking without a microwave, waiting in line with strangers — you don’t just save time. You slowly atrophy the patience, the resilience, and the serendipity that makes life an adventure.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The 1-Click World', scriptPrompt: 'Describe the seamless ease of modern apps delivering everything instantly.', cue: 'Fast, crisp opening.' },
      { time: '0:15 - 0:32', phase: 'The Hidden Toll', scriptPrompt: 'Explain how GPS shrinks the hippocampus and one-click buying kills anticipation.', cue: 'Authoritative scientific proof.' },
      { time: '0:32 - 0:48', phase: 'The Loss of Serendipity', scriptPrompt: 'Describe how eliminating wrong turns eliminates the greatest discoveries.', cue: 'Poetic, evocative storytelling.' },
      { time: '0:48 - 1:00', phase: 'The Manifesto', scriptPrompt: 'Conclude: "Don\u2019t fear friction. Friction is where character, competence, and memories are born."', cue: 'Strong, resolute closing.' },
    ],
    vocalTechnique: {
      tone: 'Energetic, questioning, incisive, and empowering.',
      tempo: '125 wpm with punchy delivery on "one tap", "one swipe".',
      powerPause: 'Pause before "Friction is where character is born".',
      advice: 'Deliver the contrast between convenience and capability clearly.',
    },
    facts: [
      'London taxi drivers spend 3 to 4 years studying for "The Knowledge" examination.',
      'Behavioral economists found people spend 30% more money when paying with contactless cards versus physical cash.',
    ],
    questions: ['What convenience has cost you something?', 'Which difficulties are worth keeping?', 'What would you make harder on purpose?'],
    vocabulary: ['frictionless', 'hippocampal atrophy', 'The Knowledge', 'serendipity', 'cognitive outsourcing'],
  },
  {
    id: 't3', title: 'Attention as a Product', subtitle: 'Who pays when it is free',
    category: 'technology', difficulty: 'Bold', minutes: 3,
    image: img(6255898), imageAlt: 'Person scrolling through social media on a smartphone indoors',
    imageDescription: 'A person illuminated in the dark by the blue glare of an infinite scroll feed. The image depicts the psychological slot machine engineered to harvest human dopamine for advertising exchanges.',
    description: 'If a service is free, your attention is the product being monetized. Infinite scroll, pull-to-refresh, and notification badges are not design accidents — they are neurochemical traps.',
    keyPoints: [
      'Variable interval rewards (the psychological engine of slot machines) are baked into pull-to-refresh feeds.',
      'Anger and moral outrage spread 6x faster on social feeds than objective nuance, creating an economic bias toward conflict.',
      'The average person touches their smartphone 2,617 times per day.',
      'Reclaiming attentional sovereignty is the prerequisite for all independent creative thought.',
    ],
    deepDive: [
      { heading: 'B.F. Skinner and Variable Rewards', body: 'In behavioral psychology, a pigeon presses a lever most frantically when the food pellets arrive on an unpredictable, variable schedule. Infinite scroll applies this exact slot-machine mechanic to human thumbs.' },
      { heading: 'The Architecture of Outrage', body: 'Platforms do not promote outrage because engineers are evil; they promote it because outrage commands the highest click-through rates. The algorithm is an amoral mirror optimizing for whatever prevents you from closing the app.' },
    ],
    stickyNotes: [
      { tag: 'The Slot Machine', title: 'Variable Reward', body: 'Pull-to-refresh is identical to pulling a Vegas slot machine lever. You never know what reward drops.', color: 'rose', rotate: 2 },
      { tag: 'The Honest Rule', title: 'Free Means You', body: 'If you aren’t paying for the product, you ARE the product being sold to advertisers.', color: 'amber', rotate: -2 },
    ],
    cinematicVoiceStory: 'Next time you pull down on a social feed to refresh it, listen closely. That mechanical drag and release was designed by engineers studying Las Vegas slot machines. When you don’t know whether the next swipe will bring a boring post or an exciting notification, your dopamine spikes. You are not browsing a social network; you are playing a casino game where the currency being wagered is your finite mortal life. The most rebellious thing you can do today is close the tab.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Slot Machine Comparison', scriptPrompt: 'Explain how pull-to-refresh was copied from Vegas casino slot machines.', cue: 'Gripping, shocking opening.' },
      { time: '0:15 - 0:32', phase: 'The Economics of Free', scriptPrompt: 'Explain how free platforms trade human dopamine on ad exchanges.', cue: 'Sharp, clear logic.' },
      { time: '0:32 - 0:48', phase: 'The Outrage Algorithm', scriptPrompt: 'Explain why anger spreads 6x faster than nuance due to engagement metrics.', cue: 'Passionate critique.' },
      { time: '0:48 - 1:00', phase: 'The Rebellious Finish', scriptPrompt: 'End with: "Put the phone down. Reclaim your mind. Your attention is your life."', cue: 'Powerful, direct call to action.' },
    ],
    vocalTechnique: {
      tone: 'Urgent, rebellious, sharp, and commanding.',
      tempo: '125 wpm with crisp articulation.',
      powerPause: 'Take a long pause before "Your attention is your life".',
      advice: 'Speak with urgency — awaken the audience to their own screen habits.',
    },
    facts: [
      'Aza Raskin, the designer who invented infinite scroll in 2006, has publicly apologized for the addictive harms it caused.',
      'Tech executives in Silicon Valley famously restrict smartphone access for their own children.',
    ],
    questions: ['What does your screen time buy you?', 'Should attention be regulated?', 'What would you redesign?'],
    vocabulary: ['variable ratio schedule', 'dopamine loop', 'infinite scroll', 'attentional sovereignty', 'monetization'],
  },

  /* ---------------- LIFE & MIND ---------------- */
  {
    id: 'l1', title: 'Small Decisions, Large Lives', subtitle: 'Compounding choices',
    category: 'life', difficulty: 'Gentle', minutes: 2,
    image: img(14240458), imageAlt: 'Aerial view of winding crossroads cutting through golden fields',
    imageDescription: 'An aerial drone perspective of two winding country roads intersecting across geometric golden farm fields. The image represents the micro-forks in the road that quietly compound into a human destiny.',
    description: 'Nobody decides their life in a single heroic epiphany. We make fifty tiny, unconscious decisions every Tuesday, and a life emerges from the compound interest of our defaults.',
    keyPoints: [
      'Around 40% of daily human actions are automatic habit loops rather than deliberate conscious decisions.',
      'A 1% daily improvement yields a 37x compounding transformation over the course of a single year.',
      'Environment architecture reliably beats raw willpower: redesigning cues prevents decision fatigue.',
      'We chronically overestimate what we can accomplish in a day and underestimate a decade of small consistency.',
    ],
    deepDive: [
      { heading: 'The Mathematics of the 1% Shift', body: 'James Clear\u2019s formula (1.01³⁶⁵ = 37.78) proves that micro-habits do not add up linearly — they compound exponentially. Conversely, a 1% daily decline (0.99³⁶⁵ = 0.03) erodes capability to near zero.' },
      { heading: 'Choice Architecture over Willpower', body: 'Nobel laureate Richard Thaler proved that humans choose the easiest default in their immediate physical environment. If the book is on the pillow, you read; if the phone is on the nightstand, you scroll.' },
    ],
    stickyNotes: [
      { tag: 'The 1% Formula', title: '1.01 vs 0.99', body: '1% better every day = 37x better in a year. 1% worse = near zero. Tiny choices run the math.', color: 'sage', rotate: 2 },
      { tag: 'Design Your Room', title: 'Cues Beat Willpower', body: 'Put the guitar on the stand, put the phone in another room. Change your space, change your life.', color: 'yellow', rotate: -2 },
    ],
    cinematicVoiceStory: 'We wait for the giant, cinematic moments to change our lives — the new year, the promotion, the lightning bolt of inspiration. But destiny is not forged in earthquakes; it is assembled in the quiet, boring decisions you make on a Tuesday morning. Choosing to walk for ten minutes. Choosing to read five pages. Choosing to drink water. A 1% improvement every day makes you thirty-seven times better in a single year. You don’t need a miracle; you just need to win the next five minutes.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Hollywood Illusion', scriptPrompt: 'Contrast movie epiphanies with the reality of daily micro-habits.', cue: 'Relatable, conversational opening.' },
      { time: '0:15 - 0:32', phase: 'The 37x Math', scriptPrompt: 'Explain the 1% compounding formula over 365 days.', cue: 'Inspiring, clear logic.' },
      { time: '0:32 - 0:48', phase: 'Environment Architecture', scriptPrompt: 'Explain why willpower fails and why designing your room succeeds.', cue: 'Practical, coaching tone.' },
      { time: '0:48 - 1:00', phase: 'The Call to Action', scriptPrompt: 'Conclude: "Stop waiting for a giant breakthrough. Win this Tuesday. Win the next five minutes."', cue: 'Energetic, motivating finish.' },
    ],
    vocalTechnique: {
      tone: 'Motivating, grounded, practical, and inspiring.',
      tempo: '120 wpm with rhythmic momentum.',
      powerPause: 'Pause before "Win the next five minutes".',
      advice: 'Speak like an encouraging mentor giving practical advice.',
    },
    facts: [
      'Duke University researchers found that over 40% of our daily actions are habits rather than conscious decisions.',
      'Habit formation takes on average 66 days to reach automaticity, not the popular myth of 21 days.',
    ],
    questions: ['Which small habit shaped you most?', 'What tiny change would compound?', 'Do you choose your defaults?'],
    vocabulary: ['compounding', 'habit loop', 'choice architecture', 'decision fatigue', 'automaticity'],
  },
  {
    id: 'l2', title: 'The Courage of Not Knowing', subtitle: 'Uncertainty as a skill',
    category: 'life', difficulty: 'Bold', minutes: 3,
    image: img(32478363), imageAlt: 'A solitary figure walking into a foggy mist-covered mountain forest',
    imageDescription: 'A solitary figure walking with calm footsteps down a path disappearing into dense mountain fog. The image symbolizes intellectual humility — stepping forward into ambiguity with courage instead of false certainty.',
    description: 'We reward swaggering confidence and punish hesitation. Yet the courage to say "I do not know" is the rarest and most potent form of human intelligence.',
    keyPoints: [
      'The Dunning–Kruger effect proves that low domain knowledge produces the most aggressive, unfounded confidence.',
      'Philip Tetlock’s "Superforecasters" excel because they treat opinions as hypotheses to be updated, not identities to defend.',
      'Ambiguity tolerance is the single strongest cognitive predictor of effective decision-making in volatile environments.',
      'Strong opinions, loosely held: the discipline is entirely in the willingness to abandon cherished views when evidence shifts.',
    ],
    deepDive: [
      { heading: 'The Dunning-Kruger Trap', body: 'Novices lack the meta-cognitive ability to recognize their own incompetence. True experts sound tentative because they understand the vast web of boundary conditions and exceptions.' },
      { heading: 'Epistemic Humility as a Weapon', body: 'The best forecasters in the world do not make dogmatic bets. They update their probabilistic beliefs in tiny increments (from 60% to 64%) as new data trickles in. They have zero ego tied to being right on day one.' },
    ],
    stickyNotes: [
      { tag: 'Dunning-Kruger', title: 'The Loudest Novice', body: 'The less someone knows about a topic, the more certain they sound. Real masters embrace nuance.', color: 'amber', rotate: -2 },
      { tag: 'The Superpower', title: 'Four Magic Words', body: '"I do not know" is not weakness. It is the only sentence that makes learning possible.', color: 'rose', rotate: 2 },
    ],
    cinematicVoiceStory: 'In modern society, we applaud the person with instant, loud, unshakeable answers on TV and in boardrooms. We treat hesitation as weakness. But look at Socrates in ancient Athens. When the Oracle of Delphi declared him the wisest man alive, Socrates smiled and explained: "I am only wiser than others because I know that I know nothing." The four most courageous words in the English language are not "I am the best." They are: "I do not know."',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Confidence Trap', scriptPrompt: 'Describe how culture rewards aggressive certainty over honest doubt.', cue: 'Critical, questioning opening.' },
      { time: '0:15 - 0:32', phase: 'The Dunning-Kruger Truth', scriptPrompt: 'Explain how novices shout while true experts sound cautious and measured.', cue: 'Sharp analytical delivery.' },
      { time: '0:32 - 0:48', phase: 'The Superforecaster Method', scriptPrompt: 'Explain how the smartest thinkers treat their beliefs as hypotheses, not dogma.', cue: 'Insightful, coaching tone.' },
      { time: '0:48 - 1:00', phase: 'The Socratic Finish', scriptPrompt: 'Conclude: "Doubt is not the enemy of intelligence; it is the doorway to it. Have the courage to say: I do not know."', cue: 'Profound, commanding close.' },
    ],
    vocalTechnique: {
      tone: 'Philosophical, courageous, nuanced, and authoritative.',
      tempo: '115 wpm with thoughtful pauses.',
      powerPause: 'Take a solid two-second pause before "I do not know".',
      advice: 'Embody the quiet confidence of someone who does not need to shout.',
    },
    facts: [
      'David Dunning and Justin Kruger won the 2000 Ig Nobel Prize in Psychology for their landmark study.',
      'Socrates was condemned to death in 399 BC partly for continually exposing the false certainty of Athenian politicians.',
    ],
    questions: ['When did you last change your mind?', 'Why is doubt socially costly?', 'What are you genuinely unsure of?'],
    vocabulary: ['epistemic humility', 'Dunning-Kruger', 'superforecasting', 'Bayesian updating', 'ambiguity tolerance'],
  },
  {
    id: 'l3', title: 'What Memory Keeps', subtitle: 'And why it rewrites',
    category: 'life', difficulty: 'Moderate', minutes: 3,
    image: img(8848784), imageAlt: 'Hands turning vintage faded black-and-white family photographs',
    imageDescription: 'Weathered hands turning the delicate sepia pages of an old family album. The image captures the fluid, reconstructive nature of human memory — a dynamic mythmaker rather than a permanent digital hard drive.',
    description: 'Memory is not a video recording. Every time you recall a scene from your past, your brain unpacks it, alters it with your current mood, and saves a modified copy.',
    keyPoints: [
      'Memory reconsolidation: recalling a memory unlocks its synaptic proteins, making it vulnerable to editing.',
      'The story you tell most frequently at dinner parties is scientifically your least historically accurate memory.',
      'Olfactory memory connects almost directly to the amygdala and hippocampus, which is why scents trigger vivid time travel.',
      'Elizabeth Loftus demonstrated that simple suggestive questioning can implant entirely false memories in over 25% of subjects.',
    ],
    deepDive: [
      { heading: 'The Chemical Window of Reconsolidation', body: 'When a memory is activated, the synaptic connections holding it become labile (chemically unstable) for several hours before protein synthesis locks them down again. Your current emotions literally rewrite your past.' },
      { heading: 'The Proustian Scent Phenomenon', body: 'Unlike vision and hearing, which route through the thalamus, scent molecules travel directly into the olfactory bulb, which has immediate wiring to the amygdala (emotion) and hippocampus (memory).' },
    ],
    stickyNotes: [
      { tag: 'Brain Secret', title: 'The Editing Booth', body: 'Your memory is not a video camera; it is an active film director constantly recutting old footage.', color: 'rose', rotate: -2 },
      { tag: 'Scent Portal', title: 'Proust’s Madeleine', body: 'A single whiff of old perfume or rain on hot asphalt can hurl you 20 years into the past in 0.1 seconds.', color: 'amber', rotate: 2 },
    ],
    cinematicVoiceStory: 'Think back to your favorite childhood memory. You can see the colors, feel the air, hear the laughter. But neuroscience reveals a shocking secret: that memory is not a video recording. Every time you recall an event, your brain pulls the memory into the editing room of your current consciousness, tints it with your present mood, and saves over the original file. The stories we tell the most are the ones we have rewritten the most. Memory is not a library of the past; it is the myth we tell ourselves to survive the present.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Nostalgic Hook', scriptPrompt: 'Ask the audience to picture their most vivid childhood memory.', cue: 'Warm, nostalgic opening.' },
      { time: '0:15 - 0:32', phase: 'The Reconsolidation Science', scriptPrompt: 'Explain that recalling a memory chemically opens it for editing.', cue: 'Surprising, clear scientific breakdown.' },
      { time: '0:32 - 0:48', phase: 'The Scent Shortcut', scriptPrompt: 'Describe how scents bypass logic and trigger instant visceral time travel.', cue: 'Evocative, sensory descriptions.' },
      { time: '0:48 - 1:00', phase: 'The Philosophical Finish', scriptPrompt: 'Conclude: "Your memory is not a camera recording history. It is an artist painting who you need to be today."', cue: 'Poetic, resonant close.' },
    ],
    vocalTechnique: {
      tone: 'Evocative, nostalgic, scientifically precise, and poetic.',
      tempo: '115 wpm with gentle pauses.',
      powerPause: 'Pause before "saves over the original file".',
      advice: 'Let your voice convey both scientific wonder and nostalgic tenderness.',
    },
    facts: [
      'Elizabeth Loftus famously convinced adult participants they had been lost in a shopping mall as children through simple photo tampering and suggestion.',
      'Flashbulb memories (like where people were on 9/11) feel 100% accurate but degrade at the exact same rate as everyday memories.',
    ],
    questions: ['Which memory returns uninvited?', 'Has a family story changed in the telling?', 'What would you rather forget?'],
    vocabulary: ['reconsolidation', 'synaptic plasticity', 'Proustian memory', 'flashbulb memory', 'confabulation'],
  },
  {
    id: 'l4', title: 'The Loneliness of Connection', subtitle: 'Never alone, rarely met',
    category: 'life', difficulty: 'Moderate', minutes: 3,
    image: img(35432405), imageAlt: 'A solitary pedestrian walking through a bustling sunlit city street',
    imageDescription: 'A solitary figure framed in golden sunlight walking amidst a blur of hundreds of hurried urban commuters. The image captures modern hyper-connectivity coexisting with acute emotional isolation.',
    description: 'We have more messaging channels, followers, and video calls than any humans in history, yet we report unprecedented epidemic loneliness. Contact is not connection.',
    keyPoints: [
      'Loneliness is a physiological distress signal driven by perceived relationship quality, not the sheer quantity of contacts.',
      'Chronic social isolation elevates systemic inflammation and carries mortality risk equivalent to smoking 15 cigarettes a day.',
      'Passive social feed scrolling exacerbates loneliness; active, reciprocal conversation diminishes it.',
      '"Weak ties" — casual exchanges with baristas, neighbors, and bus drivers — provide critical daily belonging scaffolding.',
    ],
    deepDive: [
      { heading: 'The Evolutionary Pain of Isolation', body: 'In ancestral hunter-gatherer bands, physical isolation from the tribe meant certain death. The brain developed loneliness as an acute alarm — identical to physical hunger or physical pain — designed to force the organism back toward social safety.' },
      { heading: 'The Disappearance of "Third Places"', body: 'Sociologist Ray Oldenburg warned of the collapse of "Third Places" — cafes, parks, barbershops, and community halls that are neither home nor work. Replacing physical third places with digital feeds replaces real presence with digital performance.' },
    ],
    stickyNotes: [
      { tag: 'The Barista Chat', title: 'The Power of Weak Ties', body: 'Saying two sentences to your barista boosts mood more than 20 minutes of scrolling Instagram.', color: 'rose', rotate: -2 },
      { tag: 'Health Danger', title: 'The 15 Cigarettes Fact', body: 'Chronic loneliness carries the same biological mortality risk as smoking 15 cigarettes a day.', color: 'amber', rotate: 2 },
    ],
    cinematicVoiceStory: 'You can sit on a train surrounded by three hundred people, holding a device connected to five billion human beings, and feel completely, utterly alone. We have confused contact with connection. A notification is not an embrace. A text message is not eye contact. A like is not love. Our ancient hunter-gatherer brains do not care about digital follower counts; they crave the sound of a voice, the warmth of presence, and the knowledge that someone truly sees us.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Train Contrast', scriptPrompt: 'Describe being surrounded by hundreds of people while feeling completely alone.', cue: 'Intimate, poignant opening.' },
      { time: '0:15 - 0:32', phase: 'The Biological Alarm', scriptPrompt: 'Explain how loneliness evolved as a physical survival alarm like hunger.', cue: 'Sharp scientific breakdown.' },
      { time: '0:32 - 0:48', phase: 'The Third Place Collapse', scriptPrompt: 'Mention how replacing physical community spaces with digital feeds starved us.', cue: 'Empathic cultural analysis.' },
      { time: '0:48 - 1:00', phase: 'The Human Prescription', scriptPrompt: 'End with: "Put down the screen. Look up. Go talk to a human being. Connection is not a digital feature; it is life itself."', cue: 'Warm, direct, urgent close.' },
    ],
    vocalTechnique: {
      tone: 'Empathic, poignant, warm, urgent, and deeply human.',
      tempo: '115 wpm with heartfelt pacing.',
      powerPause: 'Take a soft pause before "A like is not love".',
      advice: 'Speak directly from the heart — make every listener feel understood.',
    },
    facts: [
      'Former US Surgeon General Vivek Murthy declared loneliness an official public health epidemic in 2023.',
      'Sociological studies show the average number of close confidants Americans report has dropped from 3 to 1 since 1985.',
    ],
    questions: ['When do you feel most connected?', 'Does technology help or dilute?', 'Who have you not spoken to properly?'],
    vocabulary: ['parasocial', 'weak ties', 'Third Places', 'social homeostasis', 'systemic inflammation'],
  },

  /* ---------------- SOCIETY ---------------- */
  {
    id: 'so1', title: 'Should Cities Ban Cars?', subtitle: 'Rethinking urban space',
    category: 'society', difficulty: 'Moderate', minutes: 3,
    image: img(16438456), imageAlt: 'Lively pedestrian town square in an old European city with cafes',
    imageDescription: 'A sunlit European piazza filled with outdoor cafe tables, strolling families, and children playing on cobblestones. The absence of two-ton metal vehicles restores acoustic calm and public human intimacy.',
    description: 'Modern cities surrendered up to 60% of their public footprint to moving and storing private automobiles. Reclaiming streets for pedestrians is not anti-technology; it is pro-human.',
    keyPoints: [
      'The principle of "induced demand" proves adding highway lanes reliably generates more traffic, never less.',
      'Barcelona\u2019s "Superblocks" and Paris\u2019s "15-Minute City" transformed car intersections into public parks and plazas.',
      'Air pollution from tire microplastics and brake dust in dense traffic carries severe cardiovascular disease risks.',
      'Legitimate equity concerns must be solved for disabled residents, delivery trades, and peripheral suburban commuters.',
    ],
    deepDive: [
      { heading: 'The Trap of Induced Demand', body: 'When you widen a highway from 4 to 8 lanes, it lowers travel times temporarily. This incentivizes thousands of people who avoided driving to take their cars, filling the new lanes back to gridlock within three years.' },
      { heading: 'Barcelona’s Superblock Revolution', body: 'Barcelona grouped 9 city blocks together, restricting vehicle traffic to perimeter streets at 10 km/h. Within the interior, asphalt was converted into playgrounds, gardens, and cafes. Local retail sales soared, and asthma hospitalizations dropped.' },
    ],
    stickyNotes: [
      { tag: 'The Big Question', title: 'Who Owns The Street?', body: 'Why did we give 60% of our public space to empty parked metal boxes?', color: 'yellow', rotate: 2 },
      { tag: 'Induced Demand', title: 'More Lanes = More Traffic', body: 'Adding lanes to fix traffic is like loosening your belt to cure obesity.', color: 'rose', rotate: -2 },
    ],
    cinematicVoiceStory: 'Look down from a skyscraper onto any modern city. More than half of all public land — the space where our children could play, where cafes could spill onto sidewalks, where trees could clean our air — is covered in boiling asphalt and filled with parked cars. For a century, we designed cities for metal machines instead of flesh-and-blood human beings. Cities that ban cars from their centers aren’t going backward; they are finally remembering what a city was built for in the first place: human connection.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Spatial Question', scriptPrompt: 'Ask how much of our city space is locked up in parking asphalt.', cue: 'Provocative opening.' },
      { time: '0:15 - 0:32', phase: 'The Induced Demand Trap', scriptPrompt: 'Explain why widening roads never solves traffic congestion.', cue: 'Sharp, energetic logic.' },
      { time: '0:32 - 0:48', phase: 'The Barcelona Superblocks', scriptPrompt: 'Describe how Barcelona turned intersections into gardens and boosted retail.', cue: 'Inspiring visual storytelling.' },
      { time: '0:48 - 1:00', phase: 'The Urban Vision', scriptPrompt: 'Conclude: "A great city is not where the poor have cars; it\u2019s where the rich take public transit and children play safely in the street."', cue: 'Visionary, triumphant finish.' },
    ],
    vocalTechnique: {
      tone: 'Visionary, energetic, persuasive, and grounded.',
      tempo: '125 wpm with clear rhetorical cadence.',
      powerPause: 'Pause before "designed cities for metal machines".',
      advice: 'Paint a vision of what a livable, green human city actually looks like.',
    },
    facts: [
      'In Los Angeles, there are an estimated 3.3 parking spaces for every registered automobile.',
      'Paris converted 50,000 on-street parking spots into bike lanes and miniature parks between 2020 and 2024.',
    ],
    questions: ['Who is the street for?', 'What would you do with the space?', 'How do you balance freedom and shared good?'],
    vocabulary: ['induced demand', 'superblocks', '15-minute city', 'public realm', 'pedestrianization'],
  },
  {
    id: 'so2', title: 'The Four-Day Week', subtitle: 'Less time, same output?',
    category: 'society', difficulty: 'Gentle', minutes: 2,
    image: img(6177596), imageAlt: 'Minimalist clean modern workspace with laptop and notebook',
    imageDescription: 'A sun-drenched, uncluttered desk with an open laptop, a steaming cup of tea, and a leather notebook. The image represents the efficiency of focused, rested intellectual output over exhausted 40-hour office presence.',
    description: 'The five-day, 40-hour work week is not a fundamental law of nature. It was an industrial compromise invented by Henry Ford in 1926. A century later, trials prove four days delivers equal output with zero burnout.',
    keyPoints: [
      'The 40-hour week replaced the 100-hour Victorian factory schedule; there is nothing sacred about 5 days.',
      'Massive global trials in the UK, Japan, and Spain showed 92% of companies retained the 4-day schedule permanently.',
      'Productivity gains come from eliminating bloated meetings, not from forcing employees to sprint faster.',
      'A four-day week slashes sick leave, reduces childcare expenses, and cuts commuting carbon emissions.',
    ],
    deepDive: [
      { heading: 'Parkinson\u2019s Law and Office Bloat', body: 'Parkinson’s Law dictates that work expands to fill the time allocated for its completion. When workers are given 40 hours, low-value status meetings, administrative busywork, and performative emails expand to fill the void.' },
      { heading: 'The UK 4-Day Trial Results', body: 'In 2022, 61 UK companies tested a 32-hour week with 100% pay for 6 months. Revenue rose by 35% compared to previous periods, burnout dropped by 71%, and 92% of firms refused to return to 5 days.' },
    ],
    stickyNotes: [
      { tag: 'Parkinson’s Law', title: 'Work Expands', body: 'Give someone 40 hours, they do 15 hours of work and 25 hours of meetings and pretending to look busy.', color: 'sage', rotate: -2 },
      { tag: 'The UK Trial', title: '92% Kept It', body: 'In the largest 4-day trial in history, 92% of companies refused to go back to 5 days. Output went UP.', color: 'yellow', rotate: 2 },
    ],
    cinematicVoiceStory: 'A hundred years ago, factory workers labored six days a week, ten hours a day. When Henry Ford announced a radical five-day work week in 1926, critics predicted economic ruin. Ford discovered that rested workers built better automobiles. Today, we sit in bloated four-hour Zoom meetings, drowning in performative busywork to fill forty arbitrary hours on a calendar. The five-day week is an industrial dinosaur. We don\u2019t need more hours at a desk; we need the energy to do work that actually matters.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The 1926 History', scriptPrompt: 'Explain how Henry Ford invented the 5-day week 100 years ago.', cue: 'Historical, storytelling opening.' },
      { time: '0:15 - 0:32', phase: 'Parkinson\u2019s Law', scriptPrompt: 'Explain how 40 hours breeds pointless meetings and fake work.', cue: 'Sharp, relatable critique.' },
      { time: '0:32 - 0:48', phase: 'The Global Trial Proof', scriptPrompt: 'Share the UK trial stats: revenue up 35%, burnout down 71%.', cue: 'Authoritative data delivery.' },
      { time: '0:48 - 1:00', phase: 'The Future Manifesto', scriptPrompt: 'Conclude: "We measure work by the value created, not the hours sat in a chair. The four-day week is not the future — it is common sense."', cue: 'Bold, confident finish.' },
    ],
    vocalTechnique: {
      tone: 'Persuasive, modern, logical, and confident.',
      tempo: '120 wpm with punchy emphasis on trial statistics.',
      powerPause: 'Pause after "Henry Ford in 1926".',
      advice: 'Focus on how efficiency beats exhaustion.',
    },
    facts: [
      'Microsoft Japan tested a 4-day week in 2019 and reported a 40% jump in productivity per employee.',
      'Before 1926, the standard manufacturing week was 6 days and 60+ hours.',
    ],
    questions: ['Is your work measured by hours or output?', 'Who benefits and who is left out?', 'What would you do with the day?'],
    vocabulary: ['Parkinson’s Law', 'output-based productivity', 'burnout index', 'asynchronous work', '100-80-100 rule'],
  },
  {
    id: 'so3', title: 'Who Owns Your Data?', subtitle: 'Privacy as infrastructure',
    category: 'society', difficulty: 'Bold', minutes: 3,
    image: img(17489157), imageAlt: 'Server rack cabinet glowing with blue LED indicators in a data center',
    imageDescription: 'A towering server rack glowing with blue LED pulses in a refrigerated data center. The hardware silently processes petabytes of private biometric, behavioral, and location data traded across global exchanges.',
    description: 'Data about your location, your heart rate, your secret fears, and your purchases is generated every second. But who actually owns it? The legal reality is shockingly one-sided.',
    keyPoints: [
      'Consent through unread 40-page Terms of Service contracts is legal fiction, not voluntary agreement.',
      'Anonymized datasets can be re-identified with 99.98% accuracy using just 4 spatial-temporal location points.',
      'Data is not oil (a consumable resource); data is a permanent behavioral exhaust that tracks you for life.',
      'Privacy is a collective civil right, not an individual choice: your DNA or contacts list compromises people who never consented.',
    ],
    deepDive: [
      { heading: 'The Myth of Anonymization', body: 'Researchers at MIT showed that credit card datasets stripped of names can re-identify 90% of individuals using only 4 data points (e.g. buying coffee on Monday, gas on Tuesday, books on Thursday).' },
      { heading: 'Relational Privacy and Genetic Exhaust', body: 'When one person submits their saliva to a commercial genealogy platform, they expose the genetic markers of their siblings, parents, and cousins down to the third degree without their consent.' },
    ],
    stickyNotes: [
      { tag: 'The Terms Myth', title: 'Unread Contracts', body: 'Reading all the privacy policies you click "I Agree" to in a year would take 76 full workdays.', color: 'rose', rotate: -2 },
      { tag: 'Re-identification', title: '4 Data Points', body: 'A company only needs 4 timestamps of where you bought things to identify your exact name from "anonymous" files.', color: 'amber', rotate: 2 },
    ],
    cinematicVoiceStory: 'Right now, in a refrigerated server warehouse a thousand miles away, there is a digital twin of your life. It knows what time you woke up, who you texted, where you drove, what symptoms you searched for at 2 a.m., and how fast your heart was beating when you opened that email. You never signed a treaty; you just clicked "I Agree" on a 50-page legal document no human has ever read. Privacy is not about having something to hide; it is about having the freedom to exist without being predicted, packaged, and sold.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Digital Twin', scriptPrompt: 'Describe the digital twin of your life living in a server rack right now.', cue: 'Chilling, cinematic opening.' },
      { time: '0:15 - 0:32', phase: 'The 4-Point Trap', scriptPrompt: 'Explain how 4 location points re-identify any "anonymous" dataset.', cue: 'Sharp technical evidence.' },
      { time: '0:32 - 0:48', phase: 'The Collective Threat', scriptPrompt: 'Explain why your data compromises your family without their consent.', cue: 'Serious, civic urgency.' },
      { time: '0:48 - 1:00', phase: 'The Human Right', scriptPrompt: 'Conclude: "Privacy is not about having something to hide. Privacy is the right to remain human."', cue: 'Powerful, resounding close.' },
    ],
    vocalTechnique: {
      tone: 'Incisive, urgent, principled, and authoritative.',
      tempo: '120 wpm with chilling clarity on data surveillance.',
      powerPause: 'Pause after "digital twin of your life".',
      advice: 'Frame privacy not as paranoia, but as essential civil infrastructure.',
    },
    facts: [
      'Carnegie Mellon researchers found reading every privacy policy you encounter in a year would take 76 full 8-hour working days.',
      'Over 99% of digital ad auctions happen in under 100 milliseconds while a web page loads.',
    ],
    questions: ['What do you trade for free services?', 'Is privacy still possible?', 'Who should hold the power?'],
    vocabulary: ['data sovereignty', 're-identification', 'surveillance capitalism', 'relational privacy', 'telemetry'],
  },

  /* ---------------- WORK & BUSINESS ---------------- */
  {
    id: 'b1', title: 'Why Most Meetings Fail', subtitle: 'The most expensive habit at work',
    category: 'business', difficulty: 'Gentle', minutes: 2,
    image: img(1181370), imageAlt: 'Group of diverse professionals around a boardroom table with laptops',
    imageDescription: 'A modern conference room where eight executives stare blankly at laptop screens during a presentation. The image captures the hidden financial and cognitive drain of performative corporate meetings.',
    description: 'Meetings are corporate therapy for organizational insecurity. Most meetings could have been a three-paragraph memo, and every person in the room privately knows it.',
    keyPoints: [
      'A meeting without a documented decision to make is merely an expensive status update.',
      'Amazon replaced slide presentations with silent 6-page narrative memos read at the start of meetings.',
      'The true cost of a meeting is not the 60 minutes, but the 2 hours of fragmented focus before and after.',
      'Every attendee added beyond five people reduces the probability of open debate by 10%.',
    ],
    deepDive: [
      { heading: 'Jeff Bezos and the 6-Page Memo', body: 'Bezos banned PowerPoint at Amazon in 2004. Instead, meetings begin in 20 minutes of complete silence while all attendees read a structured narrative memo. Writing in full sentences forces the author to resolve logical contradictions that bullet points easily conceal.' },
      { heading: 'The Fragmentation Tax', body: 'A 2:00 PM meeting ruins both the 1:00 PM and 3:00 PM focus blocks. Knowledge workers operate in maker time, where creative output requires unbroken 3-hour stretches of deep work.' },
    ],
    stickyNotes: [
      { tag: 'The Amazon Rule', title: 'Silent 6-Page Memo', body: 'No PowerPoints. Write a 6-page memo. Everyone reads in silence for 20 minutes before speaking.', color: 'amber', rotate: -2 },
      { tag: 'The True Cost', title: 'The 10-Person Math', body: 'A 1-hour meeting with 10 senior managers costs $1,500 in salary alone. Was that slide worth $1,500?', color: 'rose', rotate: 2 },
    ],
    cinematicVoiceStory: 'Look at a calendar in any corporate office. It is a wall-to-wall grid of blue blocks: status syncs, alignment calls, and check-ins. Ten people in a room for an hour is not a one-hour meeting — it is a ten-hour drain on collective human intelligence. We hold meetings because talking is easier than thinking, and scheduling a call is easier than writing a clear sentence. If you want to change your work culture, cancel the presentation and write a memo.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Calendar Nightmare', scriptPrompt: 'Describe the grid of back-to-back corporate Zoom calendar blocks.', cue: 'Relatable, punchy opening.' },
      { time: '0:15 - 0:32', phase: 'The 10-Hour Math', scriptPrompt: 'Explain how 10 people in a room for 1 hour burns 10 hours of human labor.', cue: 'Sharp business logic.' },
      { time: '0:32 - 0:48', phase: 'The Amazon Solution', scriptPrompt: 'Explain Amazon\u2019s silent 6-page memo rule that banned PowerPoints.', cue: 'Inspiring management insight.' },
      { time: '0:48 - 1:00', phase: 'The Challenge', scriptPrompt: 'End with: "Before you send the calendar invite, ask: Could this be a written sentence? If yes, write it and set your team free."', cue: 'Bold, practical leadership finish.' },
    ],
    vocalTechnique: {
      tone: 'Sharp, comedic, incisive, practical, and punchy.',
      tempo: '125 wpm with crisp executive delivery.',
      powerPause: 'Pause before "talking is easier than thinking".',
      advice: 'Deliver the business math with confident authority.',
    },
    facts: [
      'Surveys indicate that senior managers spend an average of 23 hours a week in meetings, up from 10 hours in the 1960s.',
      'Asana\u2019s Anatomy of Work report found workers spend 58% of their time on "work about work" rather than their core craft.',
    ],
    questions: ['What was your last useful meeting?', 'What should replace them?', 'Who should be in the room?'],
    vocabulary: ['asynchronous communication', 'narrative memo', 'maker vs manager time', 'context-switching', 'Parkinson\u2019s Law'],
  },
  {
    id: 'b2', title: 'Craft Versus Scale', subtitle: 'What growth costs',
    category: 'business', difficulty: 'Moderate', minutes: 3,
    image: img(13005858), imageAlt: 'Artisan woodworker shaving wooden planks in a sunlit workshop',
    imageDescription: 'A master woodworker shaving curled ribbons of timber with a hand plane in a sunlit dusty atelier. The image captures the singular devotion to craft that inevitably fractures when forced into mass industrial scale.',
    description: 'Silicon Valley preaches hyper-growth as the only valid definition of success. But scaling standardizes, and standardization often destroys the exact artisanal magic customers originally fell in love with.',
    keyPoints: [
      'Scaling requires procedural standardization: removing idiosyncrasies to achieve repeatable mass production.',
      'Many century-old Japanese "shinise" businesses deliberately cap growth to protect multigenerational craftsmanship.',
      '"Diseconomies of scale" emerge when internal bureaucratic coordination costs outpace marginal production gains.',
      'Deciding "How big should this be?" is a profound strategic choice, not a failure of commercial ambition.',
    ],
    deepDive: [
      { heading: 'The Japanese Shinise Model', body: 'Japan has over 33,000 businesses older than 100 years (and over 3,000 older than 200 years). Companies like Kongo Gumi (founded in 578 AD) survived for centuries by deliberately rejecting hyper-growth and focusing on uncompromised temple restoration.' },
      { heading: 'The Tragedy of the Neighborhood Gem', body: 'A beloved local bakery is celebrated for unique sourdough baked in small batches. When private equity expands it to 50 locations, commercial frozen dough and preservatives replace the baker\u2019s intuition, turning magic into bland commodity.' },
    ],
    stickyNotes: [
      { tag: 'Japanese Wisdom', title: 'The Shinise Secrets', body: 'Japan has 33,000 companies over 100 years old. Their secret? They refused to grow too big.', color: 'sage', rotate: 2 },
      { tag: 'The Bakery Trap', title: 'Standardization Costs', body: 'Scaling means removing quirks. But often, the quirks were the entire reason people loved you.', color: 'amber', rotate: -2 },
    ],
    cinematicVoiceStory: 'Think of that tiny neighborhood restaurant you love — the handwritten menu, the chef greeting you, the imperfect, unforgettable flavors. What happens when a venture capitalist buys it and opens forty locations in five years? The magic vanishes. Why? Because to scale, you must standardize. You must replace the chef\u2019s intuition with a frozen corporate manual. Growth is not the only metric of success. Sometimes the most ambitious thing you can do is stay small, master your craft, and build something that lasts for centuries.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Beloved Local Spot', scriptPrompt: 'Describe the intimate magic of a tiny neighborhood restaurant.', cue: 'Warm, evocative opening.' },
      { time: '0:15 - 0:32', phase: 'The Scale Tragedy', scriptPrompt: 'Explain how 40 franchises kill the chef\u2019s intuition through manuals.', cue: 'Sharp business critique.' },
      { time: '0:32 - 0:48', phase: 'The 1,000-Year Japanese Firm', scriptPrompt: 'Mention Japanese shinise businesses that chose craft over hyper-growth.', cue: 'Inspiring, historical reverence.' },
      { time: '0:48 - 1:00', phase: 'The Strategic Question', scriptPrompt: 'Conclude: "Never confuse growth with greatness. Better is better; bigger is just bigger."', cue: 'Resolute, memorable finish.' },
    ],
    vocalTechnique: {
      tone: 'Artisanal, thoughtful, strategic, and poetic.',
      tempo: '115 wpm with reverent pauses for craftsmanship.',
      powerPause: 'Pause before "Better is better; bigger is just bigger".',
      advice: 'Speak with the pride of an artisan talking about their life\u2019s work.',
    },
    facts: [
      'Kongo Gumi, a Japanese temple-construction firm, operated continuously for 1,428 years.',
      'Economist E.F. Schumacher coined the phrase "Small Is Beautiful" in 1973 to champion human-scale economics.',
    ],
    questions: ['Is growth always good?', 'What loses its soul at scale?', 'What would "enough" look like?'],
    vocabulary: ['shinise', 'diseconomies of scale', 'artisanal integrity', 'hyper-growth', 'standardization'],
  },
  {
    id: 'b3', title: 'The Myth of the Lone Genius', subtitle: 'Who actually invents things',
    category: 'business', difficulty: 'Bold', minutes: 3,
    image: img(7212946), imageAlt: 'Colleagues brainstorming around laptops in a bright creative studio',
    imageDescription: 'A dynamic, diverse team collaborating across shared laptop screens and whiteboards in an open studio. The image debunks the solitary genius myth, showcasing innovation as a collective social network.',
    description: 'We love fairy tales of solitary inventors experiencing Eureka moments in garages. The historical truth is that innovation is a social web of simultaneous discovery and publicly funded infrastructure.',
    keyPoints: [
      'The principle of "Multiple Discovery": calculus, evolution, the telephone, and oxygen were discovered simultaneously by independent minds.',
      'The core technologies inside the iPhone (GPS, touchscreen, lithium-ion, the Internet) were funded by public research grants, not single tech icons.',
      'Cognitive diversity in teams outperforms homogeneous genius groups on complex problem-solving.',
      'The lone genius myth is seductive because humans crave simple heroic narratives over complex network maps.',
    ],
    deepDive: [
      { heading: 'Robert Merton and Simultaneous Discovery', body: 'Sociologist Robert Merton catalogued hundreds of major scientific breakthroughs that were discovered independently at the exact same moment in history (Newton and Leibniz, Darwin and Wallace, Bell and Gray). Ideas arrive when their cultural preconditions are ripe.' },
      { heading: 'Mariana Mazzucato’s Entrepreneurial State', body: 'Economist Mariana Mazzucato proved that virtually every breakthrough component of modern technology — the microprocessor, HTTP protocol, algorithm search, and mRNA vaccines — emerged from decades of unglamorous government research funding before private firms commercialized them.' },
    ],
    stickyNotes: [
      { tag: 'Newton & Leibniz', title: 'Simultaneous Discovery', body: 'Calculus, evolution, and telephones were all invented by two people at the exact same time.', color: 'blue', rotate: -2 },
      { tag: 'The iPhone Myth', title: 'Public Foundations', body: 'GPS, internet, touchscreens, and voice recognition were all funded by public grants before Apple assembled them.', color: 'yellow', rotate: 2 },
    ],
    cinematicVoiceStory: 'We love the Hollywood story of the lone genius — the solitary scientist yelling Eureka in a bathtub, or the visionary inventor in a Silicon Valley garage. But history tells a very different tale. Isaac Newton and Gottfried Leibniz invented calculus at the exact same time without ever speaking. Charles Darwin and Alfred Russel Wallace discovered natural selection simultaneously. Breakthroughs do not emerge from isolated brains; they emerge from the collective soil of human culture when the time is right. We do not stand alone on mountaintops; we stand on the shoulders of an unbroken chain of human collaboration.',
    speechBlueprint: [
      { time: '0:00 - 0:15', phase: 'The Hollywood Myth', scriptPrompt: 'Deconstruct the solitary garage genius narrative.', cue: 'Energetic, myth-busting start.' },
      { time: '0:15 - 0:32', phase: 'The Simultaneous Proof', scriptPrompt: 'Mention Newton/Leibniz calculus and Darwin/Wallace evolution.', cue: 'Sharp historical evidence.' },
      { time: '0:32 - 0:48', phase: 'The Public Infrastructure', scriptPrompt: 'Explain how GPS, touchscreen, and the internet were built by collective research.', cue: 'Enlightening, clear logic.' },
      { time: '0:48 - 1:00', phase: 'The Humble Truth', scriptPrompt: 'Finish: "Stop looking for lone saviors. Innovation is a team sport played across generations."', cue: 'Inspiring, collaborative finale.' },
    ],
    vocalTechnique: {
      tone: 'Inspiring, collaborative, historically authoritative, and grounded.',
      tempo: '120 wpm with strong declarative statements.',
      powerPause: 'Pause before "Innovation is a team sport".',
      advice: 'Deliver the simultaneous discovery examples with crisp clarity.',
    },
    facts: [
      'Elisha Gray filed a patent caveat for the telephone on the exact same morning as Alexander Graham Bell (February 14, 1876).',
      'The World Wide Web was invented at CERN by Tim Berners-Lee to help particle physicists share academic papers.',
    ],
    questions: ['Who gets credit, and who should?', 'Does the myth cause harm?', 'What made your best work possible?'],
    vocabulary: ['multiple discovery', 'networked innovation', 'entrepreneurial state', 'epistemological soil', 'collaborative intelligence'],
  },
];

export const totalTopics = topics.length;

export function getRandomTopic(category?: CategoryId | null, difficulty?: Difficulty | null, excludeId?: string): Topic {
  let pool = topics;
  if (category) pool = pool.filter(t => t.category === category);
  if (difficulty) pool = pool.filter(t => t.difficulty === difficulty);
  if (pool.length === 0) pool = topics;
  if (excludeId && pool.length > 1) pool = pool.filter(t => t.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getTopicsByCategory(category: CategoryId): Topic[] {
  return topics.filter(t => t.category === category);
}

export function countByCategory(category: CategoryId): number {
  return topics.filter(t => t.category === category).length;
}

export function countByDifficulty(d: Difficulty): number {
  return topics.filter(t => t.difficulty === d).length;
}

/** Build a natural cinematic narration script from a topic for voice player. */

