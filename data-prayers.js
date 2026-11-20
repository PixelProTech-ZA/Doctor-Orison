/* Doctor Orison — Prayer Chamber, daily path and lesson content.
   All prayers and lessons here are original wording written for this app.
   Scripture quotations are always pulled live from the World English Bible (bible-web.json), never retyped.
   No prayer here promises money, luck, or a particular outcome. */
(function () {
  'use strict';

  var LESSONS = [
    {
      id: 'begin', t: 'How to begin praying', time: '5 min', ref: 'matthew.6.5-8',
      intro: 'You do not need special words, a special place, or a perfect state of mind. Prayer, as Jesus describes it in the Gospels, is speaking honestly to God.',
      steps: [
        ['Find a quiet moment', 'A few minutes is enough. Turn off notifications. Sit, stand or kneel, whatever lets you be still.'],
        ['Address God', 'Start by naming who you are speaking to. Many Christians say “Father”, “Lord” or “God”. Jesus taught his disciples to begin with “Our Father” (Matthew 6:9).'],
        ['Say what is true', 'Say what you are actually feeling and thinking. The Psalms are full of honest prayers, including anger, fear and confusion.'],
        ['Listen for a moment', 'Leave a short silence at the end. Prayer is a conversation, not only a list.'],
        ['Close', 'Many people end with “Amen”, a Hebrew word meaning “so be it”. Some also end “in Jesus’ name”, a Christian practice based on John 14:13–14.']
      ],
      why: 'Why certain words are used: “Amen” affirms what was said. “In Jesus’ name” expresses that the person prays as a follower of Jesus. These are traditions of Christian prayer, not magic formulas. The words do not make the prayer work; the Bible presents prayer as a relationship.',
      limit: 'Prayer is not presented here as a way to control outcomes. It is a way to speak with God and to be changed by the conversation.',
      prayer: 'God, I do not know the right words, so I will use plain ones. Thank you for listening. Here is what is on my heart today. Help me to be honest, and help me to listen. Amen.'
    },
    {
      id: 'words', t: 'What to say, and the pattern Jesus gave', time: '6 min', ref: 'matthew.6.9-13',
      intro: 'When the disciples asked Jesus how to pray, he gave them a pattern. Many Christians pray it slowly, a phrase at a time, and add their own words in each part.',
      steps: [
        ['Honour', '“Our Father in heaven, may your name be kept holy.” Begin by remembering who God is.'],
        ['Align', '“Your kingdom come, your will be done.” Ask for what God wants, not only what you want.'],
        ['Ask', '“Give us today our daily bread.” Ask for what you need today, and notice the word “us”.'],
        ['Forgive', '“Forgive us our debts, as we also forgive our debtors.” Admit where you have fallen short and release what others owe you.'],
        ['Protect', '“Deliver us from the evil one.” Ask for safety and for help in testing times.']
      ],
      why: 'The pattern teaches an order: God first, then need. That order is a teaching, not a rule you must follow every time.',
      limit: 'The Lord’s Prayer is not a spell. Jesus warns against “vain repetitions” in the same passage (Matthew 6:7).',
      prayer: 'Father, I honour you. I ask for your way in my life. Give me what I need today. Forgive me, and help me to forgive. Keep me safe. Amen.'
    },
    {
      id: 'gratitude', t: 'How to express gratitude', time: '4 min', ref: 'psalms.100',
      intro: 'Thanksgiving is a common thread in the Psalms. It turns attention from what is missing to what is present.',
      steps: [
        ['Name three real things', 'Be specific: a person, a meal, a mercy. Specific thanks is easier than general thanks.'],
        ['Say who gave them', 'The Bible frames good things as gifts (James 1:17). Thank the giver, not only the gift.'],
        ['Include the hard things', 'You do not need to thank God for pain. You can thank God for strength, a friend, or the fact that you are still here.'],
        ['End with a decision', 'Choose one small act of generosity today.']
      ],
      why: 'Gratitude as a practice has some support in psychology research for improving mood, though results vary between people and studies. It is not a cure for depression or hardship.',
      limit: 'Gratitude is not a duty to pretend things are fine.',
      prayer: 'God, thank you for … (name three). I give you thanks for the things I overlook. Help me to notice. Amen.'
    },
    {
      id: 'guidance', t: 'How to ask for guidance', time: '5 min', ref: 'james.1.5',
      intro: 'James says that anyone who lacks wisdom should ask God, who gives generously. Many traditions also say to pair prayer with advice from wise people and with careful thought.',
      steps: [
        ['State the decision', 'Write it as one clear sentence. Vague prayers get vague clarity.'],
        ['Ask for wisdom, not only an answer', 'Ask for clear eyes and honest motives.'],
        ['Gather facts and counsel', 'Talk to people who know you and the subject. Proverbs 15:22 says plans fail without counsel.'],
        ['Take the next small step', 'Guidance is often given one step at a time.']
      ],
      why: 'Prayer does not replace thinking. The Bible’s wisdom books repeatedly link seeking God with using your mind.',
      limit: 'Be careful of any person who claims to hear a specific message from God for you and demands money or obedience.',
      prayer: 'God, I need wisdom about this decision. Show me what I am missing. Keep my motives honest, and give me wise people to talk to. Amen.'
    },
    {
      id: 'finance', t: 'Praying during financial difficulty', time: '6 min', ref: 'proverbs.21.5',
      intro: 'Money stress is heavy, and it is in the Bible too. Prayer can steady you, but it does not pay bills. Pair it with practical steps.',
      steps: [
        ['Say how bad it is', 'Tell God the real situation and the real fear.'],
        ['Ask for what you need today', '“Daily bread” is a prayer for today’s need.'],
        ['Ask for clear thinking', 'Stress narrows thinking. Ask for calm to make a plan.'],
        ['Then act', 'List income, bills and debts. Call creditors before they call you. Seek free debt counselling (in South Africa, a registered debt counsellor via the National Credit Regulator). See the Wealth Doctrine department when it is released.'],
        ['Guard yourself', 'Avoid anyone selling spiritual shortcuts to money. Nobody can sell you divine favour.']
      ],
      why: 'Scripture speaks about both trust and diligence: “The plans of the diligent surely lead to profit” (Proverbs 21:5).',
      limit: 'This prayer does not promise that your money situation will change. It asks for help, calm and clarity.',
      prayer: 'God, I am worried about money. You know exactly what I owe and what I lack. Give me what I need today. Give me a clear mind and the courage to take practical steps. Send people who can help. Amen.'
    },
    {
      id: 'grief', t: 'Praying during grief', time: '5 min', ref: 'psalms.34.18',
      intro: 'Grief has no schedule. The Bible does not hurry mourners. Jesus himself wept at a friend’s grave (John 11:35).',
      steps: [
        ['Say their name', 'Speak the name of the person you lost to God.'],
        ['Say what you miss', 'Be specific. Tears are a form of prayer.'],
        ['Ask for company', 'You do not have to feel better. Ask only not to be alone.'],
        ['Tell someone', 'Reach out to a friend, a minister or a counsellor.']
      ],
      why: 'The Psalms of lament (for example Psalm 13 and Psalm 88) show that complaint and sorrow are allowed.',
      limit: 'If grief becomes overwhelming or you think of harming yourself, please speak to a doctor or a crisis line right away. In South Africa you can call SADAG on 0800 21 22 23 (check hours on sadag.org).',
      prayer: 'God, I miss … (name). The loss is heavy. I do not have words. Stay close to me and to the others who are grieving. Amen.'
    },
    {
      id: 'family', t: 'Praying for family', time: '4 min', ref: 'colossians.3.12-14',
      intro: 'Praying for family puts names and faces in front of God. It also changes how we see them.',
      steps: [
        ['Go through names', 'Pray for each person by name, one at a time.'],
        ['Ask for their good', 'Ask for health, wisdom, safety and peace. Avoid praying that they change to suit you.'],
        ['Include the difficult ones', 'Pray for the person who irritates you. This is hard and useful.'],
        ['Add a kind act', 'Send a message or make a call today.']
      ],
      why: 'Praying for a person is not control over them. It is care, offered to God.',
      limit: 'Praying for a family member does not replace dealing with abuse or danger. Contact local services if someone is unsafe.',
      prayer: 'God, I bring my family to you: … (names). Bless them with health, peace and wisdom. Help me to love the ones I find hard. Amen.'
    },
    {
      id: 'protection', t: 'Praying for protection and peace', time: '5 min', ref: 'psalms.121',
      intro: 'Psalm 121 and Psalm 91 are traditional prayers for protection. They are also honest about danger.',
      steps: [
        ['Read slowly', 'Read Psalm 121 aloud once.'],
        ['Name the fear', 'Say exactly what is frightening you.'],
        ['Ask for peace', 'Philippians 4:6–7 links prayer with peace that guards the heart.'],
        ['Take sensible care', 'Lock doors, tell trusted people, follow safety advice. Faith and caution work together.']
      ],
      why: 'Protection prayers express trust. They are not a guarantee that nothing will happen to you.',
      limit: 'This app will not tell you that someone has cursed or spiritually attacked you. If you feel unsafe, speak to a trusted person, and to the police if there is a real threat.',
      prayer: 'God, I feel afraid about … I ask for your protection and your peace. Help me to take sensible care. Keep my mind steady tonight. Amen.'
    },
    {
      id: 'forgiveness', t: 'Praying for forgiveness', time: '5 min', ref: 'psalms.51.1-2',
      intro: 'Psalm 51 is the best-known prayer of confession in the Bible. It is honest and specific.',
      steps: [
        ['Say what you did', 'Name it plainly without excuses.'],
        ['Say you are sorry', 'Not just about the consequences, but about the harm.'],
        ['Receive forgiveness', '1 John 1:9 says that if we confess, God is faithful to forgive. Christians understand forgiveness as a gift, not a wage.'],
        ['Repair where you can', 'Apologise to the person you hurt and make amends where possible.']
      ],
      why: 'Confession is traditionally followed by change. The Bible calls this repentance, a turning around.',
      limit: 'Forgiveness from God does not remove human consequences or replace apologising to the people you hurt.',
      prayer: 'God, I did … and it was wrong. I am sorry. Forgive me and help me to change. Show me how to make it right. Amen.'
    },
    {
      id: 'nowords', t: 'When words are hard to find', time: '3 min', ref: 'romans.8.26',
      intro: 'Romans 8:26 says that the Spirit helps us in our weakness, “for we don’t know how to pray as we ought”. You are in good company.',
      steps: [
        ['Be still', 'Sit for one minute without trying to say anything.'],
        ['Use a borrowed prayer', 'Read a psalm or the Lord’s Prayer. Let someone else’s words carry you.'],
        ['Use one word', '“Help.” “Thank you.” “Sorry.” These are real prayers.'],
        ['Write it', 'Write a letter to God and do not edit it.']
      ],
      why: 'Silence and short prayers are part of the long tradition of prayer.',
      limit: 'No one needs to be eloquent for prayer to count in a Christian view.',
      prayer: 'God, I do not have the words. You know what is in my heart. Hear me. Amen.'
    },
    {
      id: 'morning', t: 'Morning prayer', time: '3 min', ref: 'psalms.5.3',
      intro: 'A morning prayer sets intention for the day. Psalm 5:3 speaks of prayer in the morning.',
      steps: [
        ['Thank', 'Thank God for the new day.'],
        ['Offer', 'Offer the day’s work and the people you will meet.'],
        ['Ask', 'Ask for patience, honesty and clear thinking.'],
        ['Look ahead', 'Name one thing you want to do well today.']
      ],
      why: 'Short and regular beats long and rare.',
      limit: 'A morning prayer does not guarantee a good day. It helps you meet the day more steadily.',
      prayer: 'God, thank you for this day. Be with me in my work and with the people I will meet. Give me patience, honesty and clear thinking. Amen.'
    },
    {
      id: 'evening', t: 'Evening prayer', time: '3 min', ref: 'psalms.4.8',
      intro: 'Evening prayer closes the day. Psalm 4:8 is a traditional bedtime verse.',
      steps: [
        ['Review', 'Go back through the day without judging.'],
        ['Thank', 'Name what went well.'],
        ['Confess', 'Mention where you fell short.'],
        ['Rest', 'Hand tomorrow’s worries to God and sleep.']
      ],
      why: 'Many Christian traditions have a version of this review, sometimes called the examen.',
      limit: 'If worry keeps you awake night after night, a doctor can help.',
      prayer: 'God, the day is done. Thank you for what was good. Forgive where I fell short. I give you tomorrow. Let me rest. Amen.'
    }
  ];

  var PRAYER_LIBRARY = [
    { id: 'p-morning', t: 'A morning prayer', cat: 'Daily', ref: 'psalms.5.3', text: 'God, thank you for this new day. I give you my work, my words and my time. Keep me honest. Keep me patient. Show me what matters today. Amen.' },
    { id: 'p-evening', t: 'An evening prayer', cat: 'Daily', ref: 'psalms.4.8', text: 'God, the day is done. I thank you for what was good and I ask pardon for where I failed. I place tomorrow in your hands. Let me rest. Amen.' },
    { id: 'p-peace', t: 'A prayer for peace', cat: 'Peace', ref: 'philippians.4.6-7', text: 'God of peace, my mind is crowded and tired. I breathe in and I give you this worry. Quiet my thoughts. Remind me of what is true. Let your peace stand guard over my heart. Amen.' },
    { id: 'p-fear', t: 'A prayer when afraid', cat: 'Protection', ref: 'isaiah.41.10', text: 'God, I am afraid, and I am telling you so. Stay with me. Help me to take the next sensible step. Surround me with people who can help. Amen.' },
    { id: 'p-work', t: 'A prayer when out of work', cat: 'Hardship', ref: 'colossians.3.23', text: 'God, I am looking for work and I am tired of hearing no. Keep my dignity. Give me energy to keep applying, wisdom to use my skills, and the right doors to open. Help me to look after my family meanwhile. Amen.' },
    { id: 'p-grief', t: 'A prayer in grief', cat: 'Grief', ref: 'psalms.34.18', text: 'God, I am carrying a loss. I do not need explanations. I need you close. Hold the ones I love who are also hurting. Help me to take today one hour at a time. Amen.' },
    { id: 'p-forgive', t: 'A prayer to forgive someone', cat: 'Forgiveness', ref: 'ephesians.4.32', text: 'God, someone hurt me and I am still carrying it. I want to be free of it. I do not feel ready, but I am willing to be made willing. Show me what forgiving looks like, and what safe boundaries look like. Amen.' },
    { id: 'p-family', t: 'A prayer for family', cat: 'Family', ref: 'colossians.3.12-14', text: 'God, I bring my family to you by name. Give each of them health, wisdom and peace. Mend what is strained between us. Make our home a place of safety and kindness. Amen.' },
    { id: 'p-start', t: 'A prayer for starting again', cat: 'Hardship', ref: 'lamentations.3.22-23', text: 'God, I want to start again. I have failed, and I am afraid to try. Help me to learn what I can, forgive myself, and take one small step today. Amen.' },
    { id: 'p-thanks', t: 'A prayer of thanks', cat: 'Gratitude', ref: 'psalms.107.1', text: 'God, thank you for the people who love me, for food on the table, for another day. Help me to notice more of what is good. Amen.' },
    { id: 'p-wisdom', t: 'A prayer for wisdom', cat: 'Guidance', ref: 'james.1.5', text: 'God, I need wisdom. Show me what I cannot see. Keep my pride out of this decision. Give me the humility to ask for advice. Amen.' },
    { id: 'p-nowords', t: 'A prayer without words', cat: 'Daily', ref: 'romans.8.26', text: 'God, you know what I mean. Hear what I cannot say. Amen.' }
  ];

  /* Daily rotation: day-of-year index into these. */
  var DAILY = {
    scripture: ['psalms.46.1', 'proverbs.3.5-6', 'philippians.4.6-7', 'isaiah.40.31', 'psalms.121.1-2', 'matthew.11.28-30', 'joshua.1.9', 'psalms.23.1-3', 'romans.15.13', 'lamentations.3.22-23', '1thessalonians.5.16-18', 'james.1.5', 'micah.6.8', 'psalms.119.105', 'proverbs.16.3', 'ecclesiastes.4.9-10', 'colossians.3.12', 'psalms.37.5', 'isaiah.43.18-19', 'john.14.27'],
    reflection: [
      'What is one thing you are carrying that you could set down for ten minutes?',
      'Who has helped you recently that you have not thanked?',
      'Where did you feel most steady today, and what was around you?',
      'What is one small step you can take on something you have been avoiding?',
      'What would it look like to be kind to yourself today?',
      'Is there a conversation you need to have, gently and honestly?',
      'What do you already have that someone else is praying for?'
    ],
    intentions: ['Patience', 'Honesty', 'Gratitude', 'Courage', 'Rest', 'Generosity', 'Focus', 'Kindness', 'Discipline', 'Humility']
  };

  var LESSONS_DAILY = [
    { t: 'Reading context', b: 'Always read the verses before and after a verse you like. A sentence can mean something different when lifted out of its paragraph.' },
    { t: 'Prayer is not a transaction', b: 'The Bible portrays prayer as relationship. It does not give a formula for guaranteed outcomes.' },
    { t: 'Rest is in the Bible', b: 'The Sabbath (Exodus 20:8–11) makes rest a commandment, not a luxury.' },
    { t: 'Honest prayer', b: 'About a third of the Psalms are laments. Complaining to God is a biblical form of prayer.' },
    { t: 'Work as dignity', b: 'Colossians 3:23 treats ordinary work as something done before God, not just for a boss.' },
    { t: 'Wisdom and planning', b: 'Proverbs praises planning and counsel together with trust in God. Faith and diligence are not opposites.' },
    { t: 'Be careful with promises', b: 'Verses written to a particular person or nation are not always personal guarantees. Read who is being addressed.' }
  ];

  window.OrisonPrayers = { LESSONS: LESSONS, PRAYER_LIBRARY: PRAYER_LIBRARY, DAILY: DAILY, LESSONS_DAILY: LESSONS_DAILY };
})();
