/* Doctor Orison — Bible reference data.
   Scripture text itself comes ONLY from bible-web.json (World English Bible, public domain).
   Everything here is reference material: book background, dictionary, topics, cross-references, commentary.
   Authorship and dating are given as traditional attribution or commonly proposed ranges; scholars differ. */
(function () {
  'use strict';

  /* a = author (traditional / attributed), w = when & setting, g = genre, s = what it is and why it was written */
  var BOOK_INFO = {
    genesis: { a: 'Traditionally Moses (scholars discuss how it was compiled)', w: 'Covers creation through Joseph in Egypt; composed and edited over a long period', g: 'Narrative and genealogy', s: 'Tells of creation, the early human story, the flood, and the family of Abraham, Isaac, Jacob and Joseph. It sets up why Israel exists as a people.' },
    exodus: { a: 'Traditionally Moses', w: 'Israel in Egypt, the escape, and the covenant at Mount Sinai', g: 'Narrative and law', s: 'Describes Israel’s slavery in Egypt, their rescue under Moses, the giving of the law, and the building of the tabernacle.' },
    leviticus: { a: 'Traditionally Moses', w: 'Set at Mount Sinai after the exodus', g: 'Law and priestly instruction', s: 'Instructions for worship, sacrifice, the priesthood and daily holiness, written for a community learning to live near the presence of God.' },
    numbers: { a: 'Traditionally Moses', w: 'The wilderness years between Sinai and the edge of Canaan', g: 'Narrative, census and law', s: 'Records Israel’s counting, their journey, their failures of trust, and the preparation of a new generation to enter the land.' },
    deuteronomy: { a: 'Traditionally Moses', w: 'Moses’ farewell speeches on the plains of Moab', g: 'Sermon and covenant renewal', s: 'Moses restates the law and calls the people to loyalty before they enter the land. Jesus quotes it often.' },
    joshua: { a: 'Unknown (Jewish tradition names Joshua, with later additions)', w: 'Entry into and settlement of Canaan', g: 'Historical narrative', s: 'The story of Israel entering the land under Joshua and dividing it among the tribes.' },
    judges: { a: 'Unknown (tradition suggests Samuel)', w: 'The period between Joshua and the kings', g: 'Historical narrative', s: 'A repeating cycle of unfaithfulness, hardship, and rescue by leaders called judges, showing a people without stable leadership.' },
    ruth: { a: 'Unknown (tradition suggests Samuel)', w: 'Set in the time of the judges', g: 'Short narrative', s: 'The story of Naomi and Ruth, a Moabite widow who stays loyal to her, and of Boaz. Ruth becomes an ancestor of King David.' },
    '1samuel': { a: 'Unknown', w: 'The shift from judges to kings, about the 11th century BC', g: 'Historical narrative', s: 'Follows Samuel, the first king Saul, and the rise of David.' },
    '2samuel': { a: 'Unknown', w: 'David’s reign, about the early 10th century BC', g: 'Historical narrative', s: 'Describes David as king, his victories, his serious failures, and the consequences in his family.' },
    '1kings': { a: 'Unknown (tradition suggests Jeremiah)', w: 'Solomon to the divided kingdom, 10th–9th centuries BC', g: 'Historical narrative', s: 'Solomon’s reign and temple, the split of the kingdom, and prophets such as Elijah.' },
    '2kings': { a: 'Unknown (tradition suggests Jeremiah)', w: 'The divided kingdom to the exile in Babylon (586 BC)', g: 'Historical narrative', s: 'Follows the kings of Israel and Judah to the fall of Samaria and then Jerusalem, and explains the exile in terms of unfaithfulness.' },
    '1chronicles': { a: 'Unknown (tradition suggests Ezra)', w: 'Written after the exile; retells history from Adam to David', g: 'Genealogy and history', s: 'Written for a community that had returned from exile, reminding them of their roots, David’s line, and temple worship.' },
    '2chronicles': { a: 'Unknown (tradition suggests Ezra)', w: 'Solomon to the decree allowing the exiles to return (about 539 BC)', g: 'History', s: 'Retells the kings of Judah with emphasis on the temple and on repentance and renewal.' },
    ezra: { a: 'Ezra, according to tradition', w: 'The return from Babylon and rebuilding the temple, Persian period', g: 'Historical narrative', s: 'Records the first returns of exiles to Jerusalem, the rebuilding of the temple, and Ezra’s teaching of the law.' },
    nehemiah: { a: 'Nehemiah (largely his own memoir)', w: 'Mid 5th century BC, Persian period', g: 'Memoir and history', s: 'Nehemiah leads the rebuilding of Jerusalem’s walls and the renewal of the community’s commitments.' },
    esther: { a: 'Unknown', w: 'The Persian royal court', g: 'Narrative', s: 'Jews across the Persian empire are threatened, and Esther and Mordecai act to save them. God is never named in the text. It explains the festival of Purim.' },
    job: { a: 'Unknown; date debated', w: 'Set in an ancient, non-Israelite setting', g: 'Wisdom poetry and dialogue', s: 'Job suffers terribly and argues with his friends about why. The book resists simple answers about suffering and justice.' },
    psalms: { a: 'Many authors: David is credited with many, also Asaph, the sons of Korah, Solomon and Moses', w: 'Collected over several centuries', g: 'Poetry: prayers and songs', s: 'The prayer and song book of Israel, with praise, lament, thanksgiving, trust and confession. It is a model for honest prayer.' },
    proverbs: { a: 'Solomon is credited with much of it; also Agur, Lemuel and unnamed sages', w: 'Collected over several centuries', g: 'Wisdom sayings', s: 'Short sayings about wisdom, work, speech, money, relationships and the fear of the Lord, meant for passing on to the young.' },
    ecclesiastes: { a: '“The Teacher” (tradition identifies him with Solomon)', w: 'Uncertain', g: 'Wisdom reflection', s: 'A searching reflection on work, wealth, pleasure and death “under the sun”, ending with reverence for God.' },
    songofsolomon: { a: 'Attributed to Solomon', w: 'Uncertain', g: 'Love poetry', s: 'A collection of poems celebrating love between a man and a woman. Jewish and Christian readers have also read it symbolically.' },
    isaiah: { a: 'The prophet Isaiah (scholars debate whether chapters 40–66 come from a later period)', w: 'Jerusalem, from the 8th century BC, with themes reaching the exile', g: 'Prophecy and poetry', s: 'Warnings of judgment, calls for justice, and promises of comfort and a coming king and servant. It is quoted widely in the New Testament.' },
    jeremiah: { a: 'The prophet Jeremiah, with his scribe Baruch', w: 'Late 7th to early 6th century BC, ending with the fall of Jerusalem (586 BC)', g: 'Prophecy', s: 'Jeremiah warns Judah, suffers for it, and promises a new covenant (chapter 31).' },
    lamentations: { a: 'Traditionally Jeremiah', w: 'After the destruction of Jerusalem, 586 BC', g: 'Poetic lament', s: 'Five poems of grief over the fallen city. Hope is spoken in the middle of the sorrow (3:21–26).' },
    ezekiel: { a: 'The priest-prophet Ezekiel', w: 'Among the exiles in Babylon, 6th century BC', g: 'Prophecy and visions', s: 'Messages of judgment and later restoration, with strong visions such as the valley of dry bones.' },
    daniel: { a: 'Daniel (date of writing is debated)', w: 'The Babylonian and Persian courts, 6th century BC', g: 'Stories and apocalyptic visions', s: 'Faithful Jews live under foreign empires. The visions point to God’s rule outlasting those empires.' },
    hosea: { a: 'The prophet Hosea', w: 'The northern kingdom, 8th century BC', g: 'Prophecy', s: 'Hosea’s marriage is used as a picture of Israel’s unfaithfulness and God’s persistent love.' },
    joel: { a: 'The prophet Joel', w: 'Date uncertain', g: 'Prophecy', s: 'A locust plague becomes a call to repentance and a promise about the Spirit, quoted in Acts 2.' },
    amos: { a: 'Amos, a shepherd from Tekoa', w: 'The northern kingdom, 8th century BC', g: 'Prophecy', s: 'A strong word against injustice and empty religion.' },
    obadiah: { a: 'The prophet Obadiah', w: 'Uncertain; after Jerusalem’s fall', g: 'Prophecy', s: 'The shortest Old Testament book: judgment on Edom for its treatment of Judah.' },
    jonah: { a: 'Unknown; the story is about the prophet Jonah', w: 'Set during the time of the Assyrian empire', g: 'Narrative', s: 'Jonah is sent to Nineveh, runs away, and has to face God’s mercy toward people he considers enemies.' },
    micah: { a: 'The prophet Micah', w: '8th century BC', g: 'Prophecy', s: 'Judgment on injustice and hope for a future ruler from Bethlehem. Micah 6:8 summarises what God asks.' },
    nahum: { a: 'The prophet Nahum', w: 'Before the fall of Nineveh, 612 BC', g: 'Prophecy', s: 'The fall of Assyria’s capital is announced as an answer to long oppression.' },
    habakkuk: { a: 'The prophet Habakkuk', w: 'Late 7th century BC', g: 'Prophecy and prayer', s: 'Habakkuk questions God about injustice and learns to wait and trust (2:4).' },
    zephaniah: { a: 'The prophet Zephaniah', w: 'Judah, 7th century BC', g: 'Prophecy', s: 'The coming “day of the Lord” as judgment and then restoration.' },
    haggai: { a: 'The prophet Haggai', w: 'About 520 BC, after the return from exile', g: 'Prophecy', s: 'Urges the returned community to finish rebuilding the temple.' },
    zechariah: { a: 'The prophet Zechariah', w: 'Beginning about 520 BC', g: 'Prophecy and visions', s: 'Visions encouraging the returned exiles, with hopeful pictures of a coming king.' },
    malachi: { a: 'The prophet Malachi', w: 'After the return from exile, probably 5th century BC', g: 'Prophecy', s: 'Calls a discouraged community back to faithfulness. It closes the Old Testament in Christian order.' },
    matthew: { a: 'Traditionally Matthew, a tax collector and apostle', w: 'Probably the later 1st century AD', g: 'Gospel', s: 'Presents Jesus as the promised Messiah, strongly connected to the Hebrew Scriptures. It includes the Sermon on the Mount.' },
    mark: { a: 'Traditionally John Mark, associated with Peter', w: 'Probably the 60s–70s AD; often considered the earliest Gospel', g: 'Gospel', s: 'A fast-moving account of Jesus’ actions, suffering and resurrection.' },
    luke: { a: 'Traditionally Luke, a physician and companion of Paul', w: 'Probably the later 1st century AD', g: 'Gospel', s: 'Addressed to Theophilus, with careful attention to the poor, women and outsiders. It continues in Acts.' },
    john: { a: 'Traditionally John the apostle', w: 'Probably the late 1st century AD', g: 'Gospel', s: 'Written, in its own words, “that you may believe that Jesus is the Christ” (20:31). It is organised around signs and teachings.' },
    acts: { a: 'Luke', w: 'Covers about AD 30–60', g: 'History', s: 'The spread of the early church from Jerusalem to Rome, including Pentecost and the missions of Paul.' },
    romans: { a: 'Paul', w: 'About AD 57, written to Christians in Rome', g: 'Letter', s: 'A careful account of sin, grace, faith and new life, and how Jews and Gentiles belong together.' },
    '1corinthians': { a: 'Paul', w: 'About AD 55, from Ephesus', g: 'Letter', s: 'Responds to divisions and problems in the Corinthian church, including the love chapter (13) and the resurrection chapter (15).' },
    '2corinthians': { a: 'Paul', w: 'About AD 56', g: 'Letter', s: 'Paul defends his ministry, speaks about weakness and comfort, and encourages generosity.' },
    galatians: { a: 'Paul', w: 'Mid 1st century AD', g: 'Letter', s: 'Argues that acceptance by God comes through faith in Christ, not through keeping the law as a badge of belonging.' },
    ephesians: { a: 'Paul (some scholars question this)', w: 'Written from prison, 1st century AD', g: 'Letter', s: 'Describes the unity of people from different backgrounds in Christ and how that shapes daily life.' },
    philippians: { a: 'Paul', w: 'Written from prison, 1st century AD', g: 'Letter', s: 'A warm letter about joy, humility and contentment under hardship.' },
    colossians: { a: 'Paul (some scholars question this)', w: 'Written from prison, 1st century AD', g: 'Letter', s: 'Emphasises the supremacy of Christ against competing teachings.' },
    '1thessalonians': { a: 'Paul', w: 'About AD 50–51; among the earliest New Testament writings', g: 'Letter', s: 'Encourages a young church and speaks about hope for those who have died.' },
    '2thessalonians': { a: 'Paul (some scholars question this)', w: '1st century AD', g: 'Letter', s: 'Clarifies questions about the “day of the Lord” and urges steady work.' },
    '1timothy': { a: 'Traditionally Paul (authorship debated)', w: '1st century AD', g: 'Pastoral letter', s: 'Guidance for Timothy on leading a church, including teaching, conduct and attitude to money.' },
    '2timothy': { a: 'Traditionally Paul (authorship debated)', w: 'Written near the end of Paul’s life, by tradition', g: 'Pastoral letter', s: 'Personal encouragement to remain faithful and to hold to the Scriptures.' },
    titus: { a: 'Traditionally Paul (authorship debated)', w: '1st century AD', g: 'Pastoral letter', s: 'Instructions for organising churches on Crete and for living good lives.' },
    philemon: { a: 'Paul', w: 'Written from prison, 1st century AD', g: 'Personal letter', s: 'Paul appeals to Philemon to receive his runaway slave Onesimus as a brother.' },
    hebrews: { a: 'Unknown (the author is not named)', w: '1st century AD', g: 'Sermon in letter form', s: 'Presents Jesus as greater than the earlier priesthood and sacrifices, and calls for perseverance. Chapter 11 is a well-known list of faith examples.' },
    james: { a: 'Traditionally James, the brother of Jesus', w: '1st century AD', g: 'Letter', s: 'Practical teaching: faith shows in action, in how we speak, treat the poor, and handle trials.' },
    '1peter': { a: 'Peter', w: '1st century AD, to believers in Asia Minor', g: 'Letter', s: 'Encouragement to people facing hostility, to live well and to hope.' },
    '2peter': { a: 'Peter (authorship debated)', w: '1st century AD', g: 'Letter', s: 'Warns against false teaching and encourages growth in knowledge and character.' },
    '1john': { a: 'Traditionally John', w: 'Late 1st century AD', g: 'Letter', s: 'Speaks of love, truth and assurance, and of testing what people teach.' },
    '2john': { a: 'Traditionally John', w: 'Late 1st century AD', g: 'Short letter', s: 'A brief letter about truth and love and caution regarding false teachers.' },
    '3john': { a: 'Traditionally John', w: 'Late 1st century AD', g: 'Short letter', s: 'A personal letter commending hospitality and warning about a domineering leader.' },
    jude: { a: 'Jude, brother of James', w: '1st century AD', g: 'Short letter', s: 'An urgent call to hold to the faith against false teachers.' },
    revelation: { a: 'A man named John (tradition identifies him with the apostle)', w: 'Traditionally late 1st century AD, to seven churches in Asia Minor', g: 'Apocalyptic letter and vision', s: 'Visions meant to comfort churches under pressure, with symbolic imagery that has been read in many ways. It ends with the promise of a renewed creation.' }
  };

  var DICTIONARY = [
    { t: 'Amen', d: 'A Hebrew word meaning roughly “truly” or “so be it”. It is used to affirm a prayer or statement.' },
    { t: 'Apostle', d: 'From a Greek word meaning “one who is sent”. In the New Testament it mainly refers to the twelve chosen by Jesus and to Paul.' },
    { t: 'Atonement', d: 'The idea of making things right between God and people. In Christian teaching it refers to what Christ’s death accomplishes; the Old Testament connects it with sacrifice, especially on the Day of Atonement (Leviticus 16).' },
    { t: 'Baptism', d: 'A washing with water that marks entry into the Christian community. Different churches practise it in different ways.' },
    { t: 'Blessing', d: 'A spoken wish or declaration of good for someone, asked from God. In the Bible it can also mean the good that God gives.' },
    { t: 'Covenant', d: 'A binding relationship with promises and responsibilities. The Bible speaks of covenants with Noah, Abraham, Israel at Sinai, David, and a “new covenant” (Jeremiah 31).' },
    { t: 'Disciple', d: 'A learner or follower. In the Gospels it often means those who followed Jesus.' },
    { t: 'Fear of the Lord', d: 'In the Old Testament this usually means reverence and respect toward God that shapes how a person lives, not only terror.' },
    { t: 'Gentile', d: 'A person who is not Jewish.' },
    { t: 'Gospel', d: 'Means “good news”. It also names the four accounts of Jesus’ life: Matthew, Mark, Luke and John.' },
    { t: 'Grace', d: 'Undeserved kindness or favour. In the New Testament it often describes how God relates to people who could not earn it.' },
    { t: 'Hallelujah', d: 'A Hebrew expression meaning “praise Yah” (praise the Lord).' },
    { t: 'Holy Spirit', d: 'In Christian teaching, God’s presence and power at work in the world and in believers. Christians understand the Spirit as one of the three persons of the Trinity.' },
    { t: 'Kingdom of God', d: 'God’s rule and the life under it. Jesus often taught about it in parables.' },
    { t: 'Messiah / Christ', d: '“Messiah” is Hebrew and “Christos” is Greek. Both mean “anointed one”. Christians identify Jesus as the Messiah.' },
    { t: 'Parable', d: 'A short story that teaches by comparison. Jesus often taught this way.' },
    { t: 'Passover', d: 'The Jewish festival remembering the escape from Egypt (Exodus 12). Jesus’ last supper with his disciples took place in the Passover season.' },
    { t: 'Pentecost', d: 'A Jewish harvest festival fifty days after Passover. Christians recall it for the coming of the Spirit in Acts 2.' },
    { t: 'Pharisee', d: 'A member of a Jewish group that emphasised careful observance of the law and tradition. They appear often in the Gospels.' },
    { t: 'Prophet', d: 'A person who speaks for God. Prophets often called people back to faithfulness and justice; they did not only predict the future.' },
    { t: 'Psalm', d: 'A poem or song, usually a prayer. There are 150 in the book of Psalms.' },
    { t: 'Redemption', d: 'Buying back or setting free, a word from the world of slavery and debt, used for God’s rescue.' },
    { t: 'Repentance', d: 'A change of mind and direction, turning away from wrong and toward God.' },
    { t: 'Resurrection', d: 'Rising from the dead. Christianity is built on the claim that Jesus was raised, and it teaches a future resurrection of believers.' },
    { t: 'Righteousness', d: 'Being in right relationship, with God and others, and acting justly. In Paul’s letters it can also mean the standing God gives to those who trust him.' },
    { t: 'Sabbath', d: 'A day of rest each week, from sundown Friday to sundown Saturday in Jewish practice (Exodus 20:8–11). Many Christians keep Sunday as a day of worship and rest.' },
    { t: 'Sadducee', d: 'A member of a Jewish group connected with the priests and temple. They did not accept the resurrection.' },
    { t: 'Salvation', d: 'Rescue or wholeness. The Bible uses it for rescue from enemies and danger, and in the New Testament for being rescued from sin and death.' },
    { t: 'Selah', d: 'A word that appears in many Psalms. Its exact meaning is uncertain; it may mark a pause or a musical break.' },
    { t: 'Shalom', d: 'A Hebrew word for peace that includes wholeness, wellbeing and right relationships.' },
    { t: 'Sheol', d: 'The Hebrew word for the place of the dead in the Old Testament. What is meant exactly is discussed by scholars.' },
    { t: 'Sin', d: 'Falling short of what God asks, in action, attitude or neglect. The Bible describes it as both individual wrongdoing and a broader brokenness.' },
    { t: 'Tabernacle', d: 'The portable tent for worship that Israel used in the wilderness (Exodus 25–40).' },
    { t: 'Temple', d: 'The permanent house of worship in Jerusalem, first built under Solomon and rebuilt after the exile.' },
    { t: 'Yahweh', d: 'The personal name of God in the Hebrew Bible. Many translations write “the LORD” in capitals. The World English Bible uses “Yahweh”. Jewish tradition avoids speaking it aloud and says “Adonai”.' }
  ];

  /* Curated topic passages. Refs are verified against bible-web.json at test time. */
  var TOPICS = [
    { id: 'anxiety', t: 'Worry and anxiety', k: ['worry', 'anxious', 'anxiety', 'stress', 'overwhelmed', 'panic', 'afraid of the future'], refs: ['philippians.4.6-7', 'matthew.6.25-34', '1peter.5.7', 'psalms.94.19'] },
    { id: 'fear', t: 'Fear and courage', k: ['fear', 'scared', 'afraid', 'courage', 'brave', 'frightened'], refs: ['joshua.1.9', 'isaiah.41.10', 'psalms.27.1', '2timothy.1.7', 'psalms.23'] },
    { id: 'grief', t: 'Grief and loss', k: ['grief', 'death', 'died', 'loss', 'mourning', 'lost someone', 'funeral'], refs: ['psalms.34.18', 'matthew.5.4', 'john.11.35', 'romans.8.38-39', '1thessalonians.4.13', 'revelation.21.4'] },
    { id: 'money', t: 'Money, work and provision', k: ['money', 'debt', 'poor', 'poverty', 'broke', 'job', 'work', 'unemployed', 'income', 'rich', 'wealth', 'bills'], refs: ['proverbs.21.5', 'proverbs.13.11', 'proverbs.22.7', 'ecclesiastes.5.10', '1timothy.6.6-10', 'luke.14.28-30', 'colossians.3.23'] },
    { id: 'forgiveness', t: 'Forgiveness', k: ['forgive', 'forgiveness', 'guilt', 'shame', 'sorry', 'wrong'], refs: ['1john.1.9', 'psalms.51.1-2', 'ephesians.4.32', 'psalms.103.12', 'matthew.6.14-15'] },
    { id: 'lonely', t: 'Loneliness', k: ['lonely', 'alone', 'abandoned', 'isolated'], refs: ['psalms.68.6', 'deuteronomy.31.6', 'hebrews.13.5', 'psalms.25.16', 'matthew.28.20'] },
    { id: 'guidance', t: 'Guidance and direction', k: ['guidance', 'direction', 'decision', 'lost', 'purpose', 'wisdom', 'confused'], refs: ['proverbs.3.5-6', 'psalms.119.105', 'james.1.5', 'psalms.32.8'] },
    { id: 'peace', t: 'Peace', k: ['peace', 'calm', 'rest', 'restless', 'tired'], refs: ['john.14.27', 'isaiah.26.3', 'philippians.4.7', 'psalms.4.8', 'matthew.11.28-30'] },
    { id: 'gratitude', t: 'Gratitude', k: ['thanks', 'grateful', 'gratitude', 'thankful'], refs: ['1thessalonians.5.18', 'psalms.100', 'psalms.107.1', 'colossians.3.15-17'] },
    { id: 'family', t: 'Family', k: ['family', 'children', 'parents', 'marriage', 'conflict', 'brother', 'sister'], refs: ['ephesians.6.1-4', 'proverbs.22.6', 'joshua.24.15', 'colossians.3.12-14'] },
    { id: 'hope', t: 'Hope', k: ['hope', 'hopeless', 'discouraged', 'despair', 'depressed'], refs: ['romans.15.13', 'lamentations.3.21-23', 'hebrews.6.19', 'psalms.42.11', 'isaiah.40.31'] },
    { id: 'again', t: 'Starting again', k: ['start again', 'new beginning', 'failure', 'failed', 'setback', 'fresh start'], refs: ['isaiah.43.18-19', 'lamentations.3.22-23', '2corinthians.5.17', 'philippians.3.13-14'] },
    { id: 'protection', t: 'Protection and safety', k: ['protect', 'protection', 'safe', 'danger', 'threat', 'harm'], refs: ['psalms.91', 'psalms.121', 'proverbs.18.10', '2thessalonians.3.3'] }
  ];

  var PEOPLE_EVENTS = [
    { t: 'Creation', refs: ['genesis.1'] }, { t: 'The flood (Noah)', refs: ['genesis.6', 'genesis.7', 'genesis.8'] },
    { t: 'Abraham called', refs: ['genesis.12'] }, { t: 'Joseph in Egypt', refs: ['genesis.37', 'genesis.39', 'genesis.41', 'genesis.45'] },
    { t: 'Moses and the burning bush', refs: ['exodus.3'] }, { t: 'Crossing the sea', refs: ['exodus.14'] },
    { t: 'The Ten Commandments', refs: ['exodus.20'] }, { t: 'Ruth', refs: ['ruth.1'] },
    { t: 'David and Goliath', refs: ['1samuel.17'] }, { t: 'Solomon asks for wisdom', refs: ['1kings.3'] },
    { t: 'Esther', refs: ['esther.4', 'esther.7'] }, { t: 'Daniel in the lions’ den', refs: ['daniel.6'] },
    { t: 'Jonah', refs: ['jonah.1', 'jonah.2', 'jonah.3'] }, { t: 'Birth of Jesus', refs: ['luke.2'] },
    { t: 'Sermon on the Mount', refs: ['matthew.5', 'matthew.6', 'matthew.7'] }, { t: 'The Lord’s Prayer', refs: ['matthew.6.9-13'] },
    { t: 'The Good Samaritan', refs: ['luke.10.25-37'] }, { t: 'The prodigal son', refs: ['luke.15.11-32'] },
    { t: 'The crucifixion', refs: ['luke.23'] }, { t: 'The resurrection', refs: ['luke.24', 'john.20'] },
    { t: 'Pentecost', refs: ['acts.2'] }, { t: 'Paul’s conversion', refs: ['acts.9'] }
  ];

  var XREF = {
    'john.3.16': ['romans.5.8', '1john.4.9-10', 'john.1.12', 'ephesians.2.8-9'],
    'psalms.23.1': ['john.10.11', 'isaiah.40.11', 'revelation.7.17'],
    'philippians.4.6': ['1peter.5.7', 'matthew.6.25-34', 'psalms.55.22'],
    'philippians.4.7': ['john.14.27', 'isaiah.26.3', 'colossians.3.15'],
    'proverbs.3.5': ['jeremiah.17.7', 'psalms.37.5', 'james.1.5'],
    'proverbs.3.6': ['psalms.37.5', 'psalms.32.8'],
    'matthew.6.9': ['luke.11.2-4'],
    'romans.8.28': ['genesis.50.20', 'romans.8.38-39'],
    'isaiah.41.10': ['deuteronomy.31.6', 'joshua.1.9', 'psalms.118.6'],
    'joshua.1.9': ['deuteronomy.31.6-8', 'isaiah.41.10'],
    'psalms.46.1': ['psalms.91.2', 'proverbs.18.10', 'nahum.1.7'],
    '1corinthians.13.4': ['colossians.3.14', 'john.13.34-35', '1john.4.7-8'],
    'matthew.11.28': ['jeremiah.31.25', 'psalms.62.1'],
    'genesis.1.1': ['john.1.1-3', 'psalms.33.6', 'hebrews.11.3', 'colossians.1.16'],
    'john.1.1': ['genesis.1.1', 'colossians.1.15-17', 'revelation.19.13'],
    'james.1.5': ['proverbs.2.6', '1kings.3.9-12'],
    'isaiah.40.31': ['psalms.103.5', '2corinthians.4.16', 'galatians.6.9'],
    'psalms.51.1': ['1john.1.9', 'psalms.32.5', 'psalms.103.12'],
    '1thessalonians.5.18': ['ephesians.5.20', 'colossians.3.17', 'psalms.107.1'],
    'lamentations.3.22': ['psalms.30.5', 'isaiah.43.18-19', 'hebrews.4.16'],
    'psalms.121.1': ['psalms.125.2', 'psalms.124.8']
  };

  /* Commentary is interpretation, not scripture. It reflects widely held readings; other readings exist. */
  var COMMENTARY = {
    'psalms.23': { title: 'Psalm 23', who: 'Attributed in its heading to David.', why: 'A personal song of trust. The shepherd image describes God providing, guiding and staying present.', mean: 'The psalm moves from green pastures to a dark valley to a table prepared. Care is described as presence and guidance through hard places, not as the absence of them.', learn: 'Notice that the valley is walked through, not skipped. Trust here is spoken inside difficulty.' },
    'john.3.16': { title: 'John 3:16', who: 'Spoken by Jesus in conversation with Nicodemus, as recorded by the author of John.', why: 'It sits in a night conversation about new birth and gives the reason the Gospel exists: love for “the world”.', mean: 'Christians read it as the core of the Gospel message: God’s giving of the Son in love, and belief as the way of receiving it.', learn: 'Read the verses around it (3:1–21) to hear the whole conversation.' },
    'philippians.4.6-7': { title: 'Philippians 4:6–7', who: 'Paul, writing from imprisonment to the church at Philippi.', why: 'Paul encourages a community under pressure to bring worry into prayer with thanksgiving.', mean: 'The promise is peace that “guards” the heart and mind. It does not promise that circumstances will change.', learn: 'Prayer here is a practice for the anxious moment: say it, name it, hand it over, give thanks for something real.' },
    'proverbs.3.5-6': { title: 'Proverbs 3:5–6', who: 'Wisdom sayings credited to Solomon, framed as a parent speaking to a child.', why: 'It teaches that wisdom includes knowing the limits of one’s own understanding.', mean: 'Trusting God does not mean switching off thinking. It means not treating one’s own view as the final authority.', learn: 'Ask: where am I leaning only on what I can see?' },
    'matthew.6.25-34': { title: 'Matthew 6:25–34', who: 'Jesus, within the Sermon on the Mount.', why: 'He speaks to people who worried about food and clothing, which were real fears for many of his listeners.', mean: 'Jesus calls people away from anxious preoccupation, pointing to God’s care. Many readers note he does not say work and planning are wrong; he says worry does not add to life.', learn: 'Separate the part you can act on today from the part you cannot.' },
    'isaiah.41.10': { title: 'Isaiah 41:10', who: 'The prophet Isaiah speaking God’s word to Israel.', why: 'It was first addressed to a people facing powerful empires, with the assurance that God stays with them.', mean: 'Many Christians also read it as personal encouragement. Keep in mind it was first spoken to a community.', learn: 'Read the verses around it to see who is being addressed.' },
    'joshua.1.9': { title: 'Joshua 1:9', who: 'God speaking to Joshua after Moses’ death.', why: 'Joshua is about to lead Israel into the land and is told to be strong because God is with him.', mean: 'The command to be courageous is paired with a promise of presence. Courage is the response, not the cause.', learn: 'Courage here is joined to preparation: verses 7–8 speak of staying with the law.' },
    'romans.8.28': { title: 'Romans 8:28', who: 'Paul, writing to the Christians in Rome.', why: 'It falls in a passage about suffering and hope.', mean: 'It is often quoted as “everything happens for a reason”. Many interpreters read it more carefully: God works for good with those who love him, even in suffering, and does not call the suffering itself good. Verse 29 describes the good in view.', learn: 'Read 8:18–39 together before applying it to a painful moment.' },
    '1thessalonians.5.18': { title: '1 Thessalonians 5:18', who: 'Paul writing to the church at Thessalonica.', why: 'It sits in a list of short instructions to a community living under pressure.', mean: 'The wording is “in everything”, not “for everything”. It invites gratitude inside every situation without calling every situation good.', learn: 'Look for one real thing to thank God for today, however small.' },
    'matthew.6.9-13': { title: 'The Lord’s Prayer', who: 'Jesus teaching his disciples how to pray.', why: 'The disciples asked to be taught to pray (Luke 11:1). This is the pattern Jesus gave.', mean: 'It moves from praise of God, to daily need (“daily bread”), to forgiveness, to protection. It is short and can be prayed slowly, phrase by phrase.', learn: 'Pray it slowly, one line at a time, adding your own words.' },
    'lamentations.3.22-23': { title: 'Lamentations 3:22–23', who: 'Traditionally Jeremiah, grieving the fall of Jerusalem.', why: 'These lines of hope appear in the middle of a book of grief.', mean: 'Hope is spoken without denying the loss around it.', learn: 'You can hold grief and hope in the same prayer.' },
    '1corinthians.13': { title: '1 Corinthians 13', who: 'Paul writing to a divided church in Corinth.', why: 'It was not written for weddings. It addresses a church proud of its gifts but short of love.', mean: 'It describes love in practical terms and says nothing else matters without it.', learn: 'Replace the word “love” with your own name and see where you fall short, then read it as a prayer.' }
  };

  var READING_PLANS = [
    { id: 'john21', t: 'The Gospel of John in 21 days', d: 'One chapter a day through the fourth Gospel.', build: function (B) { return chaptersOf(B, 'john', 1); } },
    { id: 'proverbs31', t: 'Proverbs in a month', d: 'One chapter a day, matching the day of the month.', build: function (B) { return chaptersOf(B, 'proverbs', 1); } },
    { id: 'psalms30', t: 'Psalms in 30 days', d: 'Five psalms a day.', build: function (B) { return chaptersOf(B, 'psalms', 5); } },
    { id: 'nt90', t: 'The New Testament in 90 days', d: 'About three chapters a day.', build: function (B) { return ntPlan(B, 90); } }
  ];
  function chaptersOf(B, id, per) {
    var b = B.filter(function (x) { return x.id === id; })[0], keys = [], days = [];
    for (var i = 1; i <= b.c.length; i++) keys.push(id + '.' + i);
    for (var j = 0; j < keys.length; j += per) days.push(keys.slice(j, j + per));
    return days;
  }
  function ntPlan(B, n) {
    var keys = [];
    B.filter(function (b) { return b.t === 'NT'; }).forEach(function (b) { for (var i = 1; i <= b.c.length; i++) keys.push(b.id + '.' + i); });
    var days = [], per = keys.length / n, pos = 0;
    for (var d = 0; d < n; d++) { var end = Math.round((d + 1) * per); days.push(keys.slice(pos, end)); pos = end; }
    return days;
  }

  window.OrisonBooks = { BOOK_INFO: BOOK_INFO, DICTIONARY: DICTIONARY, TOPICS: TOPICS, PEOPLE_EVENTS: PEOPLE_EVENTS, XREF: XREF, COMMENTARY: COMMENTARY, READING_PLANS: READING_PLANS };
})();
