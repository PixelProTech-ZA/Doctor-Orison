/* Doctor Orison — Botanical and Ingredient Archive (Phase 1 starter set).
   Rules used when writing these records:
   - Cultural belief is labelled as belief. Nothing here claims an ingredient brings money, luck or protection.
   - Scientific statements are kept to what is widely documented; "evidence" says how strong it is.
   - Regional names are included ONLY where well attested. Empty means "not yet verified" and can be added in the CMS.
   - Biblical references are included only where the plant or material is actually named in the text.
   - Photographs are left empty on purpose: a photo is shown only when a verified file is attached (see README, "Photographs").
   Keys: n name, e emoji, sci botanical name, cat category, art illustration style, part, where, buy, grow, names, id (identification),
   culture (belief, labelled), hist, bible, prep, ext (external use), cook, ev (evidence), tox, skin, eat, preg, env, src (sources). */
(function () {
  'use strict';
  var NOTE_GEN = 'Check with a pharmacist or doctor before using any plant medicinally if you take prescription medicine, are pregnant or breastfeeding, have a medical condition, or are treating a child.';
  var S_NIH = 'NIH National Center for Complementary and Integrative Health (nccih.nih.gov)';
  var S_KEW = 'Royal Botanic Gardens, Kew: Plants of the World Online (powo.science.kew.org)';
  var S_EMA = 'European Medicines Agency herbal monographs (ema.europa.eu)';
  var S_LIVER = 'NIH LiverTox database (livertox.nih.gov)';
  var S_SANBI = 'South African National Biodiversity Institute (sanbi.org)';

  function I(id, e, n, sci, cat, art, o) { o.id = id; o.e = e; o.n = n; o.sci = sci; o.cat = cat; o.art = art; if (!o.src) o.src = []; o.src.unshift(S_KEW); return o; }

  var ITEMS = [
    /* SPICES */
    I('cinnamon', '🌿', 'Cinnamon', 'Cinnamomum verum (true or Ceylon cinnamon); Cinnamomum cassia and C. burmannii (cassia)', 'Spices', 'bark', {
      part: 'Inner bark, dried into quills or ground.',
      where: 'True cinnamon: Sri Lanka and southern India. Cassia: southern China, Indonesia, Vietnam.',
      buy: 'Supermarkets and spice shops. Most cinnamon sold is cassia; ask for Ceylon if you want true cinnamon.',
      grow: 'Tropical tree. Not practical in most home gardens in southern Africa outside frost-free, humid areas.',
      names: [],
      idn: 'True cinnamon quills are thin, papery, layered like a cigar and light tan. Cassia is thicker, a single hard curl and darker red-brown.',
      culture: [['Belief', 'In some Western folk-magic and Latin American household traditions cinnamon is associated with prosperity and warmth. This is a folk belief with no scientific support, and it is not a promise of money.']],
      hist: 'Traded across the Indian Ocean from ancient times. Egyptian, Greek and Roman sources mention it as a costly aromatic.',
      bible: { refs: ['exodus.30.23', 'proverbs.7.17', 'songofsolomon.4.14'], note: 'Named as an ingredient in the holy anointing oil and as a perfume. Whether the ancient plant is the same species sold today is not certain.' },
      prep: 'In cooking, bark or powder is simmered in milk, tea, or stews or used in baking.',
      ext: 'Not recommended for the skin. Cinnamon bark and powder can irritate and cinnamon bark oil is a recognised skin sensitiser.',
      cook: 'Baking, porridge, curries, tea, stews, spiced drinks.',
      ev: ['Modern science', 'Cinnamon may modestly lower blood glucose in some studies, but results are mixed and it is not a treatment for diabetes.'],
      tox: 'Cassia contains coumarin, which can harm the liver at high regular intakes in sensitive people. Ceylon cinnamon has much less.',
      skin: 'Ground cinnamon and cinnamon oil can cause contact dermatitis and burns. Never apply the oil undiluted. Avoid on the face and mucous membranes.',
      eat: 'Food amounts are fine for most people. Avoid large, regular supplement doses of cassia.',
      preg: 'Food amounts are generally accepted. Avoid medicinal doses in pregnancy. Can add to the effect of diabetes medicine.',
      env: 'Plantation-grown. Buy from reputable sources.',
      src: [S_NIH, S_LIVER]
    }),
    I('cloves', '🌿', 'Cloves', 'Syzygium aromaticum', 'Spices', 'pod', {
      part: 'Dried unopened flower buds.',
      where: 'Originally the Maluku (Moluccas) islands of Indonesia. Now grown in Zanzibar, Madagascar, Indonesia and Sri Lanka.',
      buy: 'Supermarkets and spice shops, whole or ground.',
      grow: 'Tropical evergreen tree. Not practical in most of southern Africa.',
      names: [],
      idn: 'Small nail-shaped buds about 1.5–2 cm long with a four-pointed crown at the top, dark brown, very aromatic.',
      culture: [['Documented history', 'Clove was a major spice in the Indian Ocean trade. Chinese records from the Han period are commonly cited as saying officials held cloves in the mouth to sweeten the breath when speaking to the emperor.'],
      ['Belief', 'Clove is used in some folk traditions as a symbol of protection or luck. This is belief only and is not supported by evidence.']],
      hist: 'A centrepiece of the spice trade, which shaped European colonial history in Indonesia and later in Zanzibar.',
      bible: { refs: [], note: 'Cloves are not named in the Bible.' },
      prep: 'Whole in stews, rice, pickles and mulled drinks. Remove before eating.',
      ext: 'Clove oil has been used in dentistry as a short-term pain reliever (eugenol), but it must be diluted and used under advice.',
      cook: 'Spiced rice, curries, baked ham, chai, mulled drinks.',
      ev: ['Modern science', 'Eugenol, the main component, has a local anaesthetic and antiseptic effect documented in dentistry.'],
      tox: 'Clove oil is dangerous if swallowed, especially by children. It can cause liver damage and seizures. Keep it out of reach of children.',
      skin: 'Clove oil irritates skin and gums. Always dilute and avoid long use.',
      eat: 'Fine as a seasoning. Do not swallow clove oil.',
      preg: 'Food amounts are fine. Avoid medicinal doses. Eugenol may add to the effect of blood thinners and affect bleeding.',
      env: 'Plantation-grown.',
      src: [S_NIH, S_LIVER]
    }),
    I('nutmeg', '🌿', 'Nutmeg and mace', 'Myristica fragrans', 'Spices', 'seed', {
      part: 'The seed (nutmeg) and the red lacy covering of the seed (mace).',
      where: 'Banda Islands, Indonesia. Also grown in Grenada and parts of India.',
      buy: 'Supermarkets and spice shops, whole or ground.',
      grow: 'Tropical tree. Not practical in most of southern Africa.',
      names: [],
      idn: 'Oval brown seed about 2–3 cm with a netted surface. Mace is a bright red lattice wrapped around the seed, turning orange when dried.',
      culture: [['Documented history', 'Nutmeg drove a bloody struggle for control of the Banda Islands among Dutch, English and Portuguese traders in the 1600s.']],
      hist: 'One of the most valuable spices in medieval and early modern Europe.',
      bible: { refs: [], note: 'Nutmeg is not named in the Bible.' },
      prep: 'Grated finely in small pinches.',
      ext: 'Not recommended.',
      cook: 'Cream sauces, white sauce, baking, custards, spiced drinks.',
      ev: ['Modern science', 'Contains myristicin, which in large amounts has toxic psychoactive effects.'],
      tox: 'Poisoning has been reported with amounts of several grams (around a teaspoon or more of grated nutmeg). Symptoms include nausea, racing heart, confusion, hallucinations, and can last more than a day. Do not use nutmeg to get high.',
      skin: 'Low risk in food amounts.',
      eat: 'A pinch in food is safe for most people.',
      preg: 'Food amounts are fine. Avoid medicinal doses.',
      env: 'Plantation-grown.',
      src: [S_NIH]
    }),
    I('cardamom', '🌿', 'Cardamom', 'Elettaria cardamomum (green); Amomum subulatum (black)', 'Spices', 'pod', {
      part: 'Dried seed pods and the seeds inside.',
      where: 'Southern India and Sri Lanka; also Guatemala.',
      buy: 'Supermarkets and spice shops, as pods, seeds or powder.',
      grow: 'Needs a shaded, humid, tropical or subtropical climate.',
      names: [],
      idn: 'Green spindle-shaped pods about 1 cm long with small black sticky seeds inside.',
      culture: [['Documented', 'Widely used in Arabic coffee, Indian chai and Scandinavian baking.']],
      hist: 'Used in ancient India, and traded to Egypt and Greece.',
      bible: { refs: [], note: 'Cardamom is not named in the Bible.' },
      prep: 'Crush the pod, and simmer in tea, milk or rice.',
      ext: 'Not typically used on the skin.',
      cook: 'Chai, coffee, rice dishes, curries, pastries.',
      ev: ['Modern science', 'Small studies on blood pressure and digestion exist, but the evidence is limited.'],
      tox: 'Safe in food amounts.',
      skin: 'Rare allergy.',
      eat: 'Safe as a spice.',
      preg: 'Food amounts are fine. Avoid medicinal doses.',
      env: 'Plantation-grown; pick certified sources where possible.',
      src: [S_NIH]
    }),
    I('ginger', '🪴', 'Ginger', 'Zingiber officinale', 'Spices', 'root', {
      part: 'Rhizome (underground stem), usually called the root.',
      where: 'Originally South-East Asia. Grown widely in India, China, Nigeria and many tropical areas.',
      buy: 'Supermarkets, markets and spice shops.',
      grow: 'Yes. Plant a fresh piece of rhizome with buds in warm, moist, partly shaded soil. Frost-tender.',
      names: [],
      idn: 'Knobbly beige rhizome with a thin skin, yellow flesh and sharp, fresh smell.',
      culture: [['Documented', 'Used in Indian, Chinese and West African cooking and in many home remedies for nausea.']],
      hist: 'Cultivated in Asia for thousands of years and traded to Rome.',
      bible: { refs: [], note: 'Ginger is not named in the Bible.' },
      prep: 'Slice fresh ginger and simmer in water for tea.',
      ext: 'Not typically used on the skin.',
      cook: 'Teas, curries, stir-fries, baking, ginger beer.',
      ev: ['Modern science', 'Good evidence that ginger helps with nausea, including pregnancy-related nausea and motion sickness, at modest doses.'],
      tox: 'Safe in food amounts.',
      skin: 'Can irritate sensitive skin.',
      eat: 'Large amounts can cause heartburn.',
      preg: 'Commonly used for pregnancy nausea at modest doses; ask your midwife or doctor. May increase bleeding risk with blood thinners.',
      env: 'Easy to grow at home.',
      src: [S_NIH]
    }),
    I('turmeric', '🪴', 'Turmeric', 'Curcuma longa', 'Spices', 'root', {
      part: 'Rhizome, dried and ground, or fresh.',
      where: 'South Asia. Grown in India, Southeast Asia and parts of Africa.',
      buy: 'Supermarkets and spice shops.',
      grow: 'Yes in warm areas with rich, moist soil. Frost-tender.',
      names: [],
      idn: 'Orange-fleshed rhizome that stains fingers and surfaces bright yellow.',
      culture: [['Documented', 'Used in Hindu ceremonies and weddings. It is a staple in South Asian cooking.']],
      hist: 'Used in India for several thousand years.',
      bible: { refs: [], note: 'Turmeric is not named in the Bible.' },
      prep: 'Add to curries and rice. Fresh root can be grated into soups and teas.',
      ext: 'Used in some traditions as a paste; it stains skin and can cause allergy.',
      cook: 'Curries, rice, soups, golden milk.',
      ev: ['Modern science', 'Curcumin, a compound in turmeric, has been widely studied. Results in people are mixed and absorption is poor.'],
      tox: 'High-dose turmeric and curcumin supplements have been linked to rare cases of liver injury.',
      skin: 'Stains skin and fabric.',
      eat: 'Food amounts are safe for most people. Avoid supplements if you have gallstones or bile duct problems.',
      preg: 'Food amounts are fine. Avoid supplements. May interact with blood thinners.',
      env: 'Easy to grow at home in warm areas.',
      src: [S_NIH, S_LIVER]
    }),
    I('black-pepper', '🌿', 'Black pepper', 'Piper nigrum', 'Spices', 'seed', {
      part: 'Dried unripe fruit (peppercorn). White pepper is the same fruit with the skin removed.',
      where: 'Southern India (Malabar Coast). Now Vietnam, Brazil, Indonesia.',
      buy: 'Everywhere.',
      grow: 'A tropical climbing vine; not practical in most of southern Africa.',
      names: [],
      idn: 'Round dark wrinkled berries about 5 mm wide.',
      culture: [['Documented', 'Pepper was once so valuable it was used to pay taxes and rents in medieval Europe.']],
      hist: 'Traded between India and Rome. It was a core good of the spice trade.',
      bible: { refs: [], note: 'Pepper is not named in the Bible.' },
      prep: 'Ground fresh over food.',
      ext: 'Not recommended.',
      cook: 'Everything savoury.',
      ev: ['Modern science', 'Piperine can increase the absorption of some drugs and supplements, which can change their effect.'],
      tox: 'Safe in food amounts.',
      skin: 'Can irritate the eyes and nose.',
      eat: 'Large amounts may upset the stomach.',
      preg: 'Food amounts are fine.',
      env: 'Plantation-grown.',
      src: [S_NIH]
    }),
    I('cayenne', '🌶️', 'Cayenne and chilli', 'Capsicum annuum', 'Spices', 'fruit', {
      part: 'Dried ripe fruit, ground or whole.',
      where: 'Native to the Americas. Now grown worldwide.',
      buy: 'Supermarkets and markets.',
      grow: 'Yes. Warm-season crop in full sun; grows well in most of South Africa.',
      names: [],
      idn: 'Narrow red fruit 10–15 cm long, hot.',
      culture: [['Documented', 'Central to the cuisines of Africa, Asia and the Americas since arriving from the Americas in the 1500s.']],
      hist: 'Domesticated in the Americas thousands of years ago, then spread through the world after 1492.',
      bible: { refs: [], note: 'Chilli is from the Americas and is not in the Bible.' },
      prep: 'Add in small amounts to cooking.',
      ext: 'Capsaicin creams are used for localised pain relief and are sold in pharmacies.',
      cook: 'Stews, sauces, rubs.',
      ev: ['Modern science', 'Capsaicin creams have good evidence for some kinds of nerve and arthritis pain.'],
      tox: 'Very hot peppers can cause pain and vomiting.',
      skin: 'Burns skin, eyes and mucous membranes. Wash hands after handling and do not touch your eyes.',
      eat: 'Moderate in food.',
      preg: 'Food amounts are fine.',
      env: 'Easy to grow.',
      src: [S_NIH]
    }),
    I('cumin', '🌱', 'Cumin', 'Cuminum cyminum', 'Spices', 'seed', {
      part: 'Dried seeds.', where: 'Native to the eastern Mediterranean and western Asia. Grown in India, Iran and North Africa.',
      buy: 'Supermarkets and spice shops.', grow: 'Yes, as a warm-season annual in sunny positions.', names: [],
      idn: 'Small boat-shaped, ridged, yellow-brown seeds with a warm, earthy smell.',
      culture: [['Documented', 'Essential to Indian, Middle Eastern, North African and Latin American cooking.']],
      hist: 'Found in ancient Egyptian and Mesopotamian records.',
      bible: { refs: ['isaiah.28.25-27', 'matthew.23.23'], note: 'Cumin is named as a farm crop, and as one of the herbs people tithed on.' },
      prep: 'Toast the seeds dry and grind.', ext: 'Not used on skin.', cook: 'Curries, stews, beans, rubs, spice mixes.',
      ev: ['Modern science', 'Limited evidence for digestive effects.'],
      tox: 'Safe in food amounts.', skin: 'Rare allergy.', eat: 'Fine as a spice.',
      preg: 'Food amounts are fine. Avoid medicinal doses.', env: 'Easy to grow.', src: [S_NIH]
    }),
    I('coriander', '🌱', 'Coriander (seed and leaf)', 'Coriandrum sativum', 'Seeds', 'seed', {
      part: 'Seeds (coriander) and leaves (also called cilantro).',
      where: 'Mediterranean region and western Asia. Grown worldwide.', buy: 'Supermarkets and markets.',
      grow: 'Yes. Sow in cool seasons; it bolts to seed in heat.', names: [],
      idn: 'Round, ribbed, pale brown seeds. Leaves are flat, lobed and bright green.',
      culture: [['Documented', 'The leaf is divisive: some people perceive it as soapy, a trait linked to genetics.']],
      hist: 'Seeds were found in the tomb of Tutankhamun.',
      bible: { refs: ['exodus.16.31', 'numbers.11.7'], note: 'Manna is described as being like coriander seed in appearance.' },
      prep: 'Crush or grind the toasted seed.', ext: 'Not used on skin.', cook: 'Curries, pickles, stews, salsas, garnish.',
      ev: ['Modern science', 'Limited evidence for medicinal use.'],
      tox: 'Safe in food amounts.', skin: 'Rare allergy.', eat: 'Fine in food.', preg: 'Food amounts are fine.', env: 'Easy to grow.', src: [S_NIH]
    }),
    I('star-anise', '⭐', 'Star anise', 'Illicium verum', 'Spices', 'pod', {
      part: 'Dried star-shaped fruit.', where: 'South-western China and northern Vietnam.', buy: 'Supermarkets and spice shops.',
      grow: 'Subtropical tree; not practical in most of southern Africa.', names: [],
      idn: 'Eight-pointed woody star, reddish-brown, with a glossy seed in each point. Smells of liquorice.',
      culture: [['Documented', 'Key in Chinese five-spice and in pho.']],
      hist: 'Used in Chinese cooking for centuries. It is the source of shikimic acid, used in the manufacture of some antiviral medicines.',
      bible: { refs: [], note: 'Star anise is not named in the Bible.' },
      prep: 'Add whole to stews, then remove.', ext: 'Not used on skin.', cook: 'Pho, braises, mulled drinks, five-spice.',
      ev: ['Modern science', 'Limited evidence for medicinal use.'],
      tox: 'IMPORTANT: Japanese star anise (Illicium anisatum) looks similar and is poisonous. It has caused seizures in infants given contaminated herbal teas. Only buy from reliable sources. Do not give star anise tea to infants.',
      skin: 'Rare allergy.', eat: 'Fine in food from a reliable source.', preg: 'Food amounts only.', env: 'Plantation-grown.', src: [S_NIH]
    }),
    I('fennel', '🌱', 'Fennel', 'Foeniculum vulgare', 'Seeds', 'seed', {
      part: 'Seeds, bulb, leaves.', where: 'Mediterranean. Naturalised in many parts of the world, including South Africa.', buy: 'Supermarkets and spice shops.',
      grow: 'Yes. Easy, but it can become a weed.', names: [],
      idn: 'Feathery leaves; yellow umbel flowers; oval ridged seeds with a sweet aniseed scent.',
      culture: [['Documented', 'In India, roasted fennel seeds are chewed after meals.']],
      hist: 'Grown by Greeks and Romans.', bible: { refs: [], note: 'Fennel is not clearly named in the Bible.' },
      prep: 'Chew seeds or steep in hot water for tea.', ext: 'Not used on skin.', cook: 'Sausages, bread, curries, salads.',
      ev: ['Modern science', 'Limited evidence for colic and digestion.'],
      tox: 'Fennel oil contains estragole, which in high doses is considered a liver carcinogen risk in animals. Avoid concentrated oil.',
      skin: 'Rarely allergic. Can cause photosensitivity in some.', eat: 'Fine in food.', preg: 'Food amounts only. Avoid medicinal doses.', env: 'Can be invasive in gardens.', src: [S_EMA]
    }),
    I('fenugreek', '🌱', 'Fenugreek', 'Trigonella foenum-graecum', 'Seeds', 'seed', {
      part: 'Seeds and leaves.', where: 'India, the Mediterranean and North Africa.', buy: 'Spice shops, Indian grocers.',
      grow: 'Yes, as a cool-season annual.', names: [],
      idn: 'Small, hard, square-ish golden-brown seeds with a maple-like smell.',
      culture: [['Documented', 'Used in Indian, Ethiopian and Middle Eastern cooking.']],
      hist: 'Found in Egyptian tombs.', bible: { refs: [], note: 'Fenugreek is not named in the Bible.' },
      prep: 'Toast lightly, soak, or grind.', ext: 'Not recommended.', cook: 'Curry powders, pickles, flatbreads.',
      ev: ['Modern science', 'Some studies suggest a small effect on blood glucose. Evidence is limited.'],
      tox: 'Can lower blood sugar and cause stomach upset.', skin: 'Allergy possible, especially if you are allergic to legumes.',
      eat: 'Fine as a spice.', preg: 'Avoid medicinal doses in pregnancy; it may stimulate the uterus.', env: 'Easy to grow.', src: [S_NIH]
    }),
    I('saffron', '🌸', 'Saffron', 'Crocus sativus', 'Spices', 'flower', {
      part: 'Dried stigmas (thread-like parts) of the flower.', where: 'Iran (most), Spain, India, Morocco.', buy: 'Spice shops. Very expensive: be wary of cheap “saffron”, which may be dyed safflower or marigold.',
      grow: 'Yes in cool, dry-summer climates. Each flower has 3 stigmas, and about 150 flowers make 1 g.', names: [],
      idn: 'Deep red thread, trumpet-shaped end. Dissolves in warm water giving golden yellow.',
      culture: [['Documented', 'Prized in Persian, Spanish and Indian cooking and in historic dyeing.']],
      hist: 'Cultivated for thousands of years; depicted in Minoan frescoes.',
      bible: { refs: ['songofsolomon.4.14'], note: 'Saffron is named in a list of fragrant plants.' },
      prep: 'Steep a pinch in warm water or milk before adding.', ext: 'Not used on skin.', cook: 'Paella, biryani, risotto Milanese, desserts.',
      ev: ['Modern science', 'Some small trials on mood. Evidence is limited and not strong enough to recommend as treatment.'],
      tox: 'Large amounts (5 g or more) are toxic.', skin: 'Low risk.', eat: 'Fine as a pinch.', preg: 'Food amounts are fine. Avoid medicinal doses.', env: 'Labour intensive to harvest.', src: [S_NIH]
    }),
    I('vanilla', '🌸', 'Vanilla', 'Vanilla planifolia', 'Spices', 'pod', {
      part: 'Cured seed pod.', where: 'Native to Mexico. Grown in Madagascar, Comoros, Indonesia, Uganda.', buy: 'Supermarkets (beans, extract, paste).',
      grow: 'Climbing orchid for tropical areas. Hand pollination needed outside its native range.', names: [],
      idn: 'Long, slender dark brown pods, oily and supple, with tiny black seeds inside.',
      culture: [['Documented', 'Edmond Albius, an enslaved 12-year-old on Réunion, devised the hand-pollination method in 1841 that made vanilla farming possible beyond Mexico.']],
      hist: 'Used by the Totonac and Aztecs, then spread by Spain.', bible: { refs: [], note: 'Vanilla is from the Americas and is not in the Bible.' },
      prep: 'Split the pod and scrape out seeds.', ext: 'Not used on skin.', cook: 'Desserts, drinks, baking.',
      ev: ['Modern science', 'No medical claims are well supported.'], tox: 'Safe in food.', skin: 'Rare allergy.', eat: 'Safe.', preg: 'Food amounts are fine.', env: 'Check for fair trade.', src: []
    }),

    /* LEAVES */
    I('bay', '🍃', 'Bay leaf', 'Laurus nobilis', 'Leaves', 'sprig', {
      part: 'Leaves, dried or fresh.', where: 'Mediterranean.', buy: 'Supermarkets, markets and garden centres.',
      grow: 'Yes. Slow-growing evergreen. Takes frost and drought once established.', names: [],
      idn: 'Smooth, dark green, leathery lance-shaped leaves with a spicy aroma when crushed. Beware of lookalikes: cherry laurel and mountain laurel leaves are toxic.',
      culture: [['Documented history', 'In ancient Greece and Rome, laurel wreaths crowned victors, poets and generals, associated with Apollo.'], ['Belief', 'Some modern folk traditions write a wish on a bay leaf and burn it. This has no documented ancient origin and no evidence of effect. Burning leaves indoors can create smoke irritation and fire risk.']],
      hist: 'The word “laureate” comes from laurel.', bible: { refs: [], note: 'The Bible does not clearly name the bay laurel. Some older English translations mention a “green bay tree”, but translators differ on what plant is meant.' },
      prep: 'Add one or two leaves to soups and stews while cooking. Remove before serving.', ext: 'Not recommended.', cook: 'Stocks, stews, beans, sauces.',
      ev: ['Modern science', 'No strong evidence for health benefits at culinary amounts.'],
      tox: 'Whole dried leaves stay stiff and sharp after cooking. They can cause choking or injury to the throat or gut if swallowed. Always remove them.',
      skin: 'Fresh leaves and oil can cause contact dermatitis.', eat: 'Cook with it; do not eat the leaf.', preg: 'Food amounts are fine.', env: 'Easy to grow in a pot.', src: [S_NIH]
    }),
    I('rosemary', '🍃', 'Rosemary', 'Salvia rosmarinus (formerly Rosmarinus officinalis)', 'Leaves', 'sprig', {
      part: 'Leaves and flowering tips.', where: 'Mediterranean coast. Common in South African gardens.', buy: 'Supermarkets, nurseries and markets.',
      grow: 'Yes. Easy, sun-loving, drought tolerant.', names: [],
      idn: 'Needle-like dark green leaves with a pale underside, woody stems and a resinous scent. Small blue flowers.',
      culture: [['Documented', 'Rosemary has long been tied to remembrance. In Shakespeare’s Hamlet, Ophelia says “rosemary, that’s for remembrance”. Sprigs are worn at Anzac Day commemorations.']],
      hist: 'Used in Greek and Roman cooking and as a funeral herb in parts of Europe.', bible: { refs: [], note: 'Rosemary is not named in the Bible.' },
      prep: 'Use leaves in roasts and breads. Steep in hot water for a mild tea.', ext: 'Used in hair rinses in some traditions. Do not use concentrated essential oil undiluted.', cook: 'Roast meats, potatoes, bread, marinades.',
      ev: ['Modern science', 'Rosemary has antioxidant compounds. Claims for memory and hair growth have limited evidence.'],
      tox: 'Safe in food. The essential oil is concentrated and can cause seizures if swallowed in quantity.', skin: 'Diluted oil may irritate. Do a patch test.', eat: 'Food amounts only.', preg: 'Food amounts are fine. Avoid medicinal doses in pregnancy.', env: 'Easy to grow.', src: [S_NIH]
    }),
    I('thyme', '🍃', 'Thyme', 'Thymus vulgaris', 'Leaves', 'sprig', {
      part: 'Leaves and flowering tops.', where: 'Southern Europe.', buy: 'Supermarkets, nurseries and markets.', grow: 'Yes. Sunny, well-drained soil, drought-tolerant.', names: [],
      idn: 'Tiny grey-green oval leaves on woody stems with a warm herbal scent.',
      culture: [['Documented', 'Ancient Greeks burned it as incense in temples, and medieval European women are said to have given sprigs to knights as tokens of courage.']],
      hist: 'Egyptians are commonly cited as having used thyme in embalming.', bible: { refs: [], note: 'Thyme is not named in the Bible.' },
      prep: 'Strip leaves from stems and add to dishes.', ext: 'Not recommended undiluted.', cook: 'Stews, roasts, soups, bouquet garni.',
      ev: ['Modern science', 'Thymol is an antiseptic ingredient in some mouthwashes. Thyme tea is a traditional cough remedy, with limited evidence.'],
      tox: 'Safe in food amounts.', skin: 'Thyme oil is strong and can irritate; always dilute.', eat: 'Food amounts only.', preg: 'Food amounts are fine.', env: 'Easy to grow.', src: [S_EMA]
    }),
    I('basil', '🍃', 'Basil', 'Ocimum basilicum', 'Leaves', 'sprig', {
      part: 'Leaves.', where: 'Tropical Asia. Grown in warm climates worldwide.', buy: 'Supermarkets and nurseries.', grow: 'Yes. Warm-season, frost-tender annual.', names: [],
      idn: 'Soft, glossy green oval leaves, square stems, strong sweet smell. Holy basil (tulsi) is a different species, Ocimum tenuiflorum.',
      culture: [['Documented', 'In Hindu tradition tulsi (holy basil, Ocimum tenuiflorum) is sacred and often kept in household courtyards. It is a different species from culinary basil.'], ['Belief', 'In some Western folk traditions sweet basil is linked with prosperity or luck. This is a belief with no evidence of effect.']],
      hist: 'The name comes from the Greek basileus, “king”.', bible: { refs: [], note: 'Basil is not named in the Bible.' },
      prep: 'Tear fresh leaves into dishes at the end of cooking.', ext: 'Not recommended.', cook: 'Pesto, tomato dishes, salads, curries (Thai basil).',
      ev: ['Modern science', 'No strong medical evidence at food amounts.'],
      tox: 'Safe in food amounts.', skin: 'Rare allergy.', eat: 'Fine.', preg: 'Food amounts are fine.', env: 'Easy to grow.', src: []
    }),
    I('mint', '🍃', 'Mint', 'Mentha spicata (spearmint); Mentha × piperita (peppermint)', 'Leaves', 'sprig', {
      part: 'Leaves.', where: 'Europe and Asia. Grows widely.', buy: 'Supermarkets, markets, nurseries.', grow: 'Yes. Very easy and spreads aggressively; keep it in a pot.', names: [],
      idn: 'Square stems, toothed oval leaves, strong menthol or sweet-minty smell.',
      culture: [['Documented', 'The Roman poet Ovid describes Baucis rubbing a table with mint before serving guests, a sign of hospitality.'], ['Belief', 'Some folk traditions link mint with prosperity. This is belief with no evidence of effect.']],
      hist: 'Used in Greek, Roman, Middle Eastern and Indian food and drinks.', bible: { refs: ['matthew.23.23', 'luke.11.42'], note: 'Mint is named as one of the herbs people tithed on.' },
      prep: 'Steep fresh leaves in hot water for tea.', ext: 'Menthol products are used on the skin. Do not apply peppermint oil to the face of babies or small children.', cook: 'Tea, salads, sauces, drinks, tabbouleh.',
      ev: ['Modern science', 'Peppermint oil capsules have decent evidence for irritable bowel syndrome symptoms. Peppermint tea is not the same as the capsules.'],
      tox: 'Peppermint oil can worsen reflux and is dangerous if swallowed undiluted.', skin: 'Menthol can irritate. Keep away from the eyes.', eat: 'Fine in food and tea.', preg: 'Food amounts are fine.', env: 'Invasive in gardens.', src: [S_NIH]
    }),
    I('sage', '🍃', 'Sage', 'Salvia officinalis', 'Leaves', 'sprig', {
      part: 'Leaves.', where: 'Mediterranean.', buy: 'Supermarkets and nurseries.', grow: 'Yes. Sunny, well-drained.', names: [],
      idn: 'Soft grey-green, velvety, oblong leaves with a pebbled surface.',
      culture: [['Documented', 'Name comes from Latin salvare, “to heal”. White sage (Salvia apiana) is a different plant, used by some Native American peoples in ceremonies. It is culturally significant and overharvested; do not treat it as interchangeable.']],
      hist: 'A medieval European kitchen and medicine herb.', bible: { refs: [], note: 'Sage is not named in the Bible.' },
      prep: 'Fry in butter, or use in stuffings.', ext: 'Not recommended.', cook: 'Stuffings, brown butter, sausages.',
      ev: ['Modern science', 'Limited evidence. Contains thujone, which is neurotoxic in large doses.'],
      tox: 'Avoid large amounts or oil: thujone can cause seizures.', skin: 'Low risk.', eat: 'Food amounts only.', preg: 'Avoid medicinal amounts in pregnancy.', env: 'Do not buy wild-harvested white sage.', src: [S_EMA]
    }),
    I('lemongrass', '🍃', 'Lemongrass', 'Cymbopogon citratus', 'Leaves', 'sprig', {
      part: 'Stalk base and leaves.', where: 'Tropical Asia. Grows well in South Africa’s warmer regions.', buy: 'Supermarkets and markets.', grow: 'Yes. Clumping grass; frost-tender.', names: [],
      idn: 'Tall grass with a bulb-like pale stalk base and a strong lemon scent when bruised.',
      culture: [['Documented', 'Used throughout South-East Asian cooking, and as “fever tea” in parts of Africa and the Caribbean.']],
      hist: 'Domesticated in South Asia.', bible: { refs: [], note: 'Lemongrass is not named in the Bible.' },
      prep: 'Bruise the stalk and simmer in water.', ext: 'Not recommended undiluted.', cook: 'Thai and Vietnamese soups, curries, tea.',
      ev: ['Modern science', 'Limited evidence.'], tox: 'Safe in food and tea.', skin: 'The oil can irritate.', eat: 'Fine.', preg: 'Food amounts are fine. Avoid medicinal doses.', env: 'Easy to grow.', src: [S_NIH]
    }),
    I('eucalyptus', '🍃', 'Eucalyptus', 'Eucalyptus globulus and related species', 'Leaves', 'sprig', {
      part: 'Leaves, steam-distilled into oil.', where: 'Australia. Widely planted in South Africa, where many species are invasive.', buy: 'Pharmacies sell eucalyptus oil and chest rubs.', grow: 'Yes, but check whether it is allowed locally; many are declared invaders in South Africa.', names: [],
      idn: 'Mature leaves are long, curved and leathery with an oily scent; young leaves are round and blue-grey.',
      culture: [['Documented', 'Indigenous Australians have used eucalyptus leaves for a long time.']],
      hist: 'Introduced to South Africa in the 19th century for timber.', bible: { refs: [], note: 'Eucalyptus is from Australia and is not in the Bible.' },
      prep: 'A few drops of oil in a bowl of hot water for steam inhalation, with care to avoid burns. Do not use with small children.', ext: 'Only diluted oils.', cook: 'Not used in cooking.',
      ev: ['Modern science', 'Eucalyptus oil in chest rubs gives a cooling sensation. Evidence for treating infections is weak.'],
      tox: 'Eucalyptus oil is poisonous if swallowed. As little as a few millilitres has caused serious poisoning in children. Keep out of reach.', skin: 'Dilute. Never apply to the face of an infant.', eat: 'Do not eat the oil.', preg: 'Avoid oil in pregnancy unless advised.', env: 'Invasive in many areas.', src: [S_NIH, S_SANBI]
    }),
    I('hyssop', '🍃', 'Hyssop', 'Hyssopus officinalis (garden hyssop). The biblical “hyssop” is debated; Origanum syriacum (Syrian oregano / za’atar) is a leading candidate', 'Leaves', 'sprig', {
      part: 'Leaves and flowering tops.', where: 'Southern Europe and the Mediterranean.', buy: 'Herb nurseries.', grow: 'Yes.', names: [],
      idn: 'Small narrow leaves, blue-purple flower spikes, minty aroma.',
      culture: [['Documented', 'Used in ritual cleansing in ancient Israel, with a plant branch used to sprinkle.']],
      hist: 'The plant called ezov in Hebrew is debated among scholars.',
      bible: { refs: ['psalms.51.7', 'exodus.12.22', 'leviticus.14.4', 'john.19.29'], note: 'Hyssop is used for sprinkling and cleansing. Which plant the text means is uncertain.' },
      prep: 'Culinary use in small amounts as a herb.', ext: 'Not recommended.', cook: 'Garden hyssop is a bitter minty herb used sparingly.',
      ev: ['Modern science', 'Limited evidence.'], tox: 'Hyssop oil contains pinocamphone and can cause seizures. Avoid the oil.', skin: 'Avoid undiluted oil.', eat: 'Small food amounts only.', preg: 'Avoid in pregnancy.', env: 'Easy to grow.', src: [S_EMA]
    }),

    /* FLOWERS */
    I('hibiscus', '🌸', 'Hibiscus (roselle)', 'Hibiscus sabdariffa', 'Flowers', 'flower', {
      part: 'Fleshy red calyces (the part around the flower).', where: 'West Africa and tropical Asia. Grown widely.', buy: 'Markets and spice shops (dried).', grow: 'Yes in warm areas. Annual.', names: [['zobo', 'Hausa name, used in Nigeria, for the drink'], ['bissap', 'Senegal (Wolof) name for the drink'], ['sorrel', 'Caribbean name for the drink']],
      idn: 'Red, fleshy, ribbed calyces around a seed pod. Not the same as the large ornamental hibiscus (Hibiscus rosa-sinensis).',
      culture: [['Documented', 'A festive and everyday drink in West Africa and the Caribbean.']],
      hist: 'Domesticated in West Africa. Brought to the Americas through the Atlantic trade.', bible: { refs: [], note: 'Roselle is not named in the Bible.' },
      prep: 'Steep dried calyces in hot water, sweeten, cool and drink.', ext: 'Not typically used.', cook: 'Zobo, bissap, sorrel drink, jams.',
      ev: ['Modern science', 'Several small trials show a modest blood pressure lowering effect.'],
      tox: 'May lower blood pressure. Interacts with blood pressure medicine and possibly some other drugs.', skin: 'Low risk.', eat: 'Fine as a drink.', preg: 'Avoid medicinal amounts in pregnancy.', env: 'Easy to grow.', src: [S_NIH]
    }),
    I('lavender', '🌸', 'Lavender', 'Lavandula angustifolia', 'Flowers', 'flower', {
      part: 'Flower buds.', where: 'Mediterranean. Grown in cool, dry places around the world.', buy: 'Nurseries, herb shops, pharmacies (oil).', grow: 'Yes. Sunny, well-drained.', names: [],
      idn: 'Grey-green narrow leaves, spikes of purple flowers, sweet clean scent.',
      culture: [['Documented', 'The name is commonly linked with the Latin lavare, “to wash”, because the Romans scented baths with it.']],
      hist: 'Used in Mediterranean households for scent.', bible: { refs: [], note: 'Lavender is not clearly named in the Bible. The “spikenard” of the Gospels is a different plant.' },
      prep: 'A few dried buds in a muslin bag can scent a drawer or a warm (not hot) bath.', ext: 'Diluted oil is common in massage; patch test first.', cook: 'Small amounts in baking and teas.',
      ev: ['Modern science', 'Silexan, an oral lavender oil preparation, has had positive trials for anxiety. Lavender aromatherapy for sleep has weak evidence.'],
      tox: 'The oil is not for swallowing, except in a regulated product.', skin: 'Can cause dermatitis. Dilute.', eat: 'Culinary amounts only.', preg: 'Avoid medicinal doses.', env: 'Easy to grow.', src: [S_NIH]
    }),
    I('chamomile', '🌼', 'Chamomile', 'Matricaria chamomilla (German); Chamaemelum nobile (Roman)', 'Flowers', 'flower', {
      part: 'Flower heads.', where: 'Europe and western Asia.', buy: 'Supermarkets as tea.', grow: 'Yes.', names: [],
      idn: 'Small white-petalled daisy with a raised yellow cone and an apple-like scent.',
      culture: [['Documented', 'A common bedtime tea in Europe and Latin America.']],
      hist: 'Used in ancient Egypt, Greece and Rome.', bible: { refs: [], note: 'Chamomile is not named in the Bible.' },
      prep: 'Steep a heaped teaspoon of dried flowers in hot water for 5 minutes.', ext: 'Cooled tea is used as a compress.', cook: 'Tea.',
      ev: ['Modern science', 'Some evidence for mild anxiety and sleep, but results are mixed.'],
      tox: 'Safe in tea.', skin: 'Can cause allergy in people allergic to the daisy family (ragweed, chrysanthemum, marigold).', eat: 'Tea is fine.', preg: 'Avoid heavy use in pregnancy.', env: 'Easy to grow.', src: [S_NIH]
    }),
    I('rose', '🌹', 'Rose', 'Rosa × damascena; Rosa gallica; Rosa centifolia', 'Flowers', 'flower', {
      part: 'Petals and hips.', where: 'Grown worldwide; the Damask rose is famous in Bulgaria, Turkey and Iran.', buy: 'Spice shops and Middle Eastern grocers (edible petals and rose water).', grow: 'Yes.', names: [],
      idn: 'Layered petals with a strong sweet scent. Only use roses that have not been sprayed.',
      culture: [['Documented', 'Rose water is used in Persian, Middle Eastern and Indian food. Roses are tied to love and remembrance in many cultures.']],
      hist: 'Cultivated in Persia and Rome.', bible: { refs: ['songofsolomon.2.1', 'isaiah.35.1'], note: '“Rose” in translations may refer to other flowers; the identification is debated.' },
      prep: 'Use food-grade rose water sparingly in desserts and drinks.', ext: 'Rose water is used in skincare.', cook: 'Turkish delight, baklava, lassi, jam.',
      ev: ['Modern science', 'Rose hips are a source of vitamin C. Other claims have limited evidence.'],
      tox: 'Only use unsprayed, edible roses.', skin: 'Rare allergy.', eat: 'Edible petals only.', preg: 'Food amounts are fine.', env: 'Easy to grow.', src: []
    }),
    I('calendula', '🌼', 'Calendula', 'Calendula officinalis', 'Flowers', 'flower', {
      part: 'Flower heads.', where: 'Mediterranean region. Grown in gardens worldwide.', buy: 'Pharmacies and herb shops (creams, dried petals), nurseries.', grow: 'Yes. Easy annual.', names: [],
      idn: 'Orange or yellow daisy-like flower with sticky leaves.',
      culture: [['Documented', 'Marigold petals have been used to colour food and as a skin salve in Europe for centuries.']],
      hist: 'Used in medieval European gardens.', bible: { refs: [], note: 'Calendula is not named in the Bible.' },
      prep: 'Infuse petals in oil for skin balms, or steep in water for a rinse.', ext: 'Calendula creams are used for minor skin irritation.', cook: 'Petals as a garnish.',
      ev: ['Modern science', 'Some evidence for calendula cream in radiation dermatitis and minor wounds. Evidence is limited.'],
      tox: 'Safe in food as a garnish.', skin: 'Allergy in people allergic to the daisy family.', eat: 'Petals only.', preg: 'Avoid medicinal use.', env: 'Easy to grow.', src: [S_NIH]
    }),
    I('jasmine', '🌸', 'Jasmine', 'Jasminum sambac; Jasminum officinale', 'Flowers', 'flower', {
      part: 'Flowers.', where: 'South Asia and the Middle East.', buy: 'Tea shops (jasmine tea); nurseries.', grow: 'Yes in warm areas.', names: [],
      idn: 'Small white tubular flowers with a heavy sweet scent. Do not confuse with Carolina jessamine (Gelsemium sempervirens), which is poisonous.',
      culture: [['Documented', 'Jasmine garlands are used in South Asian ceremonies. Jasmine tea is a Chinese tradition.']],
      hist: 'Cultivated for perfume in Persia and India.', bible: { refs: [], note: 'Jasmine is not named in the Bible.' },
      prep: 'Brew jasmine-scented tea.', ext: 'Used in perfumery.', cook: 'Tea.',
      ev: ['Modern science', 'Little reliable evidence for medicinal use.'], tox: 'Carolina jessamine is highly toxic; confirm the species.', skin: 'Rare allergy.', eat: 'Tea only.', preg: 'Food amounts are fine.', env: 'Easy to grow.', src: []
    }),

    /* ROOTS */
    I('liquorice', '🪴', 'Liquorice root', 'Glycyrrhiza glabra', 'Roots', 'root', {
      part: 'Root.', where: 'Southern Europe and western Asia.', buy: 'Herb shops, sweet shops, pharmacies.', grow: 'Needs deep, sandy, well-drained soil.', names: [],
      idn: 'Long, brown, woody roots with a sweet yellow interior.',
      culture: [['Documented', 'Liquorice sticks were found in the tomb of Tutankhamun.']],
      hist: 'Used in Egypt, Greece, India and China.', bible: { refs: [], note: 'Liquorice is not clearly named in the Bible.' },
      prep: 'Chew a small piece or steep a little in hot water.', ext: 'Not used on skin.', cook: 'Sweets, teas.',
      ev: ['Modern science', 'Glycyrrhizin in liquorice can raise blood pressure and lower potassium.'],
      tox: 'Eating about 50 g/day of real liquorice for 2 weeks or more can cause high blood pressure and low potassium, and has been linked to heart rhythm problems.', skin: 'Low risk.', eat: 'Avoid regular large amounts, especially with high blood pressure or heart disease.', preg: 'Avoid in pregnancy.', env: 'Check sources.', src: [S_NIH, S_LIVER]
    }),
    I('galangal', '🪴', 'Galangal', 'Alpinia galanga', 'Roots', 'root', {
      part: 'Rhizome.', where: 'South-East Asia.', buy: 'Asian grocers.', grow: 'Yes in warm, humid areas.', names: [],
      idn: 'Pale, shiny skin with ringed pink-tinged bands and a piney, peppery taste. Harder than ginger.',
      culture: [['Documented', 'Essential in Thai and Indonesian cooking.']],
      hist: 'Brought to Europe by Arab traders.', bible: { refs: [], note: 'Galangal is not named in the Bible.' },
      prep: 'Slice into soups and curries.', ext: 'Not used on skin.', cook: 'Tom kha, curry pastes.',
      ev: ['Modern science', 'Limited evidence for health claims.'], tox: 'Safe in food amounts.', skin: 'Rare allergy.', eat: 'Fine.', preg: 'Food amounts are fine.', env: 'Easy to grow in warm areas.', src: []
    }),

    /* SEEDS */
    I('sesame', '🌱', 'Sesame', 'Sesamum indicum', 'Seeds', 'seed', {
      part: 'Seeds.', where: 'Africa and India. Grown in Ethiopia, Sudan, Nigeria, India.', buy: 'Supermarkets.', grow: 'Yes in warm areas.', names: [],
      idn: 'Tiny flat oval seeds, white, tan or black.',
      culture: [['Documented', 'One of the oldest oil crops, used from India to Africa.']],
      hist: 'Farmed for thousands of years.', bible: { refs: [], note: 'Sesame is not named in the Bible.' },
      prep: 'Toast lightly.', ext: 'Sesame oil is used as a massage oil in some cultures.', cook: 'Tahini, bread, stir-fries.',
      ev: ['Modern science', 'A nutritious source of fats, protein and calcium.'],
      tox: 'A major food allergen. Sesame allergy can be severe.', skin: 'Rare allergy.', eat: 'Avoid if allergic.', preg: 'Food amounts are fine.', env: 'Check for fair trade.', src: []
    }),
    I('mustard', '🌱', 'Mustard seed', 'Brassica juncea; Sinapis alba', 'Seeds', 'seed', {
      part: 'Seeds.', where: 'Europe, Asia. Grown worldwide.', buy: 'Supermarkets.', grow: 'Yes.', names: [],
      idn: 'Small round seeds, yellow-white, brown or black.',
      culture: [['Documented', 'Used in Indian, European and African cooking.']],
      hist: 'Used since ancient times.', bible: { refs: ['matthew.13.31-32', 'matthew.17.20'], note: 'Jesus uses the mustard seed as a picture of something very small that grows large.' },
      prep: 'Toast in oil until they pop.', ext: 'Mustard plasters are a traditional but risky remedy and can burn skin.', cook: 'Pickles, curries, dressings, condiments.',
      ev: ['Modern science', 'Mustard oil compounds irritate the skin.'], tox: 'Safe in food.', skin: 'Mustard plasters can cause blistering.', eat: 'Fine.', preg: 'Food amounts are fine.', env: 'Easy to grow.', src: []
    }),

    /* FRUITS */
    I('lemon', '🍋', 'Lemon', 'Citrus × limon', 'Fruits', 'fruit', {
      part: 'Juice, zest.', where: 'Origin in Asia. Grown in warm areas worldwide.', buy: 'Everywhere.', grow: 'Yes in frost-free areas; can grow in a pot.', names: [],
      idn: 'Yellow oval fruit with a nipple at the end and a thick aromatic peel.',
      culture: [['Documented', 'Lemon water and lemon-honey drinks are common home drinks for colds.']],
      hist: 'Spread along trade routes from Asia to the Mediterranean.', bible: { refs: [], note: 'Lemon is not named in the Bible.' },
      prep: 'Squeeze into water or tea.', ext: 'Lemon juice on skin in sunlight can cause burns and blisters (phytophotodermatitis).', cook: 'Dressings, baking, drinks, preserved lemon.',
      ev: ['Modern science', 'A source of vitamin C. It does not cure colds.'],
      tox: 'Acid can wear tooth enamel. Rinse your mouth after.', skin: 'Do not apply juice to skin and then go into the sun.', eat: 'Fine.', preg: 'Food amounts are fine.', env: 'Easy to grow.', src: []
    }),
    I('pomegranate', '🍎', 'Pomegranate', 'Punica granatum', 'Fruits', 'fruit', {
      part: 'Seeds with juicy coverings (arils).', where: 'Iran and the Himalayas to the Mediterranean.', buy: 'Supermarkets (in season).', grow: 'Yes. Hardy and drought-tolerant.', names: [],
      idn: 'Round red-brown fruit with a crown-shaped calyx and many ruby seeds inside.',
      culture: [['Documented', 'In Jewish tradition the pomegranate is linked with the 613 commandments (a popular teaching). In Greek myth it features in the story of Persephone.']],
      hist: 'One of the earliest cultivated fruits.', bible: { refs: ['exodus.28.33-34', 'songofsolomon.4.3', 'deuteronomy.8.8'], note: 'Pomegranates decorated the priest’s robe and are named among the fruits of the land.' },
      prep: 'Eat the seeds or juice them.', ext: 'Not typically used on skin.', cook: 'Salads, juices, sauces, dishes.',
      ev: ['Modern science', 'Rich in polyphenols. Juice may interact with some medicines, including some blood pressure and cholesterol drugs.'],
      tox: 'Safe as food.', skin: 'Rare allergy.', eat: 'Fine.', preg: 'Food amounts are fine.', env: 'Easy to grow.', src: [S_NIH]
    }),
    I('coconut', '🥥', 'Coconut', 'Cocos nucifera', 'Fruits', 'fruit', {
      part: 'Water, flesh, milk, oil.', where: 'Tropical coasts. Mozambique, Kenya, Tanzania and West Africa all have coconut.', buy: 'Supermarkets and markets.', grow: 'Yes in tropical, frost-free coast areas.', names: [],
      idn: 'Large brown husked nut with three eyes.',
      culture: [['Documented', 'Essential in coastal African, South Asian and Pacific cooking.']],
      hist: 'Spread across the Indian Ocean.', bible: { refs: [], note: 'Coconut is not named in the Bible.' },
      prep: 'Crack, drain the water, scrape the flesh.', ext: 'Coconut oil is a common moisturiser and hair oil.', cook: 'Curries, rice, desserts.',
      ev: ['Modern science', 'High in saturated fat. Health claims are mixed.'],
      tox: 'Safe in food.', skin: 'Can clog pores for some.', eat: 'Fine in moderation.', preg: 'Food amounts are fine.', env: 'Check labels.', src: []
    }),
    I('dates', '🌴', 'Dates', 'Phoenix dactylifera', 'Fruits', 'fruit', {
      part: 'Fruit.', where: 'Middle East and North Africa.', buy: 'Supermarkets.', grow: 'Yes in hot, dry areas.', names: [],
      idn: 'Oval brown sweet fruit with a single long seed.',
      culture: [['Documented', 'Dates are eaten to break the fast during Ramadan in many Muslim communities.']],
      hist: 'Cultivated for at least 5,000 years.', bible: { refs: ['psalms.92.12'], note: 'The palm tree appears as a symbol of flourishing. The word “honey” in some verses may refer to date syrup, which some scholars suggest.' },
      prep: 'Eat as is, or stoned and blended.', ext: 'Not used on skin.', cook: 'Desserts, energy balls, stews.',
      ev: ['Modern science', 'High in sugar and fibre.'], tox: 'Safe.', skin: 'None.', eat: 'Fine; watch the sugar.', preg: 'Fine.', env: 'Water-intensive.', src: []
    }),

    /* SWEETENERS */
    I('honey', '🍯', 'Honey', 'Produced by bees (Apis mellifera and others)', 'Sweeteners', 'sweet', {
      part: 'The honey itself.', where: 'Wherever bees forage.', buy: 'Supermarkets, markets, local beekeepers.', grow: 'Not a plant. Can be produced by beekeeping.', names: [],
      idn: 'Thick golden syrup. Fake or adulterated honey exists; raw local honey from a known beekeeper is the safest.',
      culture: [['Documented', 'In Jewish tradition apples are dipped in honey at Rosh Hashanah for a sweet new year.'], ['Belief', 'In some folk traditions honey is linked to sweetness in life or luck. This is belief only.']],
      hist: 'One of humanity’s oldest sweeteners.', bible: { refs: ['exodus.3.8', 'psalms.119.103', 'proverbs.24.13'], note: 'The land is described as flowing with milk and honey. Honey also appears as a picture of sweetness.' },
      prep: 'Stir into warm (not boiling) drinks.', ext: 'Honey dressings are used in some clinical wound care. Use only medical-grade honey.', cook: 'Baking, drinks, dressings.',
      ev: ['Modern science', 'Honey can soothe coughs in children over 1 year, with evidence similar to some cough medicines.'],
      tox: 'NEVER give honey to babies under 12 months old. It can carry spores that cause infant botulism.', skin: 'Low risk.', eat: 'Fine for adults; it is still sugar.', preg: 'Fine.', env: 'Support local beekeepers.', src: [S_NIH]
    }),
    I('sugar', '🍯', 'Brown sugar, cane sugar and molasses', 'Saccharum officinarum', 'Sweeteners', 'sweet', {
      part: 'Sugar cane juice, crystallised.', where: 'Tropical regions. South Africa’s KwaZulu-Natal and Mpumalanga produce cane.', buy: 'Supermarkets.', grow: 'Yes in frost-free areas.', names: [],
      idn: 'A tall grass with thick jointed stalks.',
      culture: [['Documented history', 'Sugar was produced by enslaved labour in the Atlantic plantations. That history is part of the heritage of many communities.'], ['Belief', 'Sugar is used in some folk traditions as a symbol of sweetness. No evidence of supernatural effect.']],
      hist: 'Originated in New Guinea and spread to Asia, then to the Americas.', bible: { refs: [], note: 'Refined sugar is not named in the Bible.' },
      prep: 'Blackstrap molasses is the dark byproduct of sugar refining.', ext: 'Sugar scrubs are used in skincare.', cook: 'Baking, drinks.',
      ev: ['Modern science', 'Brown sugar is white sugar with some molasses. Molasses has small amounts of iron and calcium.'],
      tox: 'High intake contributes to tooth decay and metabolic disease.', skin: 'None.', eat: 'Limit.', preg: 'Fine.', env: 'Sugar cane has environmental impact.', src: []
    }),

    /* RESINS */
    I('frankincense', '🌳', 'Frankincense', 'Boswellia sacra, B. carterii, B. serrata and related species', 'Resins', 'resin', {
      part: 'Dried sap (resin) from the trunk.', where: 'Oman, Yemen, Somalia, Ethiopia, Eritrea and India.', buy: 'Spice shops and incense sellers.', grow: 'Trees grow in arid zones.', names: [],
      idn: 'Pale yellow to amber tear-shaped resin pieces that smell of pine and citrus when warmed.',
      culture: [['Documented', 'A major ancient trade good on the Incense Route. Burned in temples and churches.']],
      hist: 'Traded for thousands of years between Arabia, Africa and the Mediterranean.', bible: { refs: ['matthew.2.11', 'exodus.30.34', 'leviticus.2.1'], note: 'One of the gifts brought to the infant Jesus. It was also part of temple incense.' },
      prep: 'Burned as incense on charcoal.', ext: 'Not recommended undiluted.', cook: 'Not typically eaten, though some traditions chew gum.',
      ev: ['Modern science', 'Boswellia extracts (B. serrata) have been studied for joint pain with some positive but limited results.'],
      tox: 'Smoke is irritating. Burn in a ventilated space away from children and people with asthma.', skin: 'Oil can irritate.', eat: 'Do not eat resin.', preg: 'Avoid medicinal use.', env: 'Over-tapping and loss of trees is a major concern. Buy sustainably.', src: [S_NIH]
    }),
    I('myrrh', '🌳', 'Myrrh', 'Commiphora myrrha', 'Resins', 'resin', {
      part: 'Dried resin.', where: 'Somalia, Ethiopia, Yemen.', buy: 'Spice shops, incense sellers.', grow: 'Desert thorn tree.', names: [],
      idn: 'Reddish-brown irregular lumps with a bitter, balsamic scent.',
      culture: [['Documented', 'Used in embalming, perfume and ritual incense.']],
      hist: 'Traded in antiquity. Myrrh was part of the embalming of the dead.', bible: { refs: ['matthew.2.11', 'john.19.39', 'mark.15.23', 'exodus.30.23'], note: 'A gift to the infant Jesus, used with spices for his burial, and a component of the holy anointing oil.' },
      prep: 'Burned as incense.', ext: 'Myrrh tincture is used in some mouthwashes. Not for open wounds.', cook: 'Not used.',
      ev: ['Modern science', 'Myrrh has traditional use in oral care. Evidence is limited.'],
      tox: 'Can cause stomach upset, and may affect blood sugar and blood thinning.', skin: 'May irritate.', eat: 'Do not swallow.', preg: 'Avoid: it may stimulate the uterus.', env: 'Over-harvesting is a concern.', src: [S_NIH]
    }),

    /* GRAINS */
    I('rice', '🌾', 'Rice', 'Oryza sativa; Oryza glaberrima (African rice)', 'Grains', 'grain', {
      part: 'Grain.', where: 'Asia. African rice was domesticated in West Africa.', buy: 'Everywhere.', grow: 'Yes in wet or paddy conditions.', names: [],
      idn: 'Slender cereal grass with grains in drooping panicles.',
      culture: [['Documented', 'Throwing rice at weddings is a long-standing custom linked to wishes for fertility and plenty. In many Asian cultures rice is a symbol of life and abundance.']],
      hist: 'Domesticated in Asia about 9,000 years ago; African rice in the Niger delta region later.', bible: { refs: [], note: 'Rice is not named in the Bible.' },
      prep: 'Rinse and simmer. Cool leftover rice quickly and reheat once only to avoid food poisoning (Bacillus cereus).', ext: 'Rice water is used in some hair and skin practices. Evidence is limited.', cook: 'Staple food.',
      ev: ['Modern science', 'A staple. Raw rice contains arsenic, which can be higher in some rice; vary your grains.'],
      tox: 'Reheated rice can cause food poisoning if kept warm.', skin: 'None.', eat: 'Fine.', preg: 'Fine.', env: 'Rice paddies produce methane.', src: []
    }),
    I('millet', '🌾', 'Millet', 'Pennisetum glaucum (pearl millet); Eleusine coracana (finger millet)', 'Grains', 'grain', {
      part: 'Grain.', where: 'Sahel and eastern Africa; also India.', buy: 'Health shops and African grocers.', grow: 'Yes in dry, hot areas. Highly drought-tolerant.', names: [['mahangu', 'Oshiwambo name for pearl millet in Namibia']],
      idn: 'Pearl millet has dense cylindrical seed heads on tall stalks.',
      culture: [['Documented', 'A traditional staple across the Sahel, where it is made into porridge and beer.']],
      hist: 'Domesticated in West Africa about 4,500 years ago.', bible: { refs: ['ezekiel.4.9'], note: 'Millet is named in a list of grains.' },
      prep: 'Cook as porridge.', ext: 'Not used on skin.', cook: 'Porridge, flatbreads, beer.',
      ev: ['Modern science', 'Gluten-free and nutritious.'], tox: 'Safe.', skin: 'None.', eat: 'Fine.', preg: 'Fine.', env: 'Climate-resilient crop.', src: []
    }),
    I('sorghum', '🌾', 'Sorghum', 'Sorghum bicolor', 'Grains', 'grain', {
      part: 'Grain.', where: 'Domesticated in north-east Africa.', buy: 'Health shops and African grocers; known as mabele in South Africa.', grow: 'Yes. Very drought tolerant.', names: [['mabele', 'Sesotho / Setswana / Sepedi name for sorghum']],
      idn: 'Tall cereal with grain heads at the top of the stalk.',
      culture: [['Documented', 'A staple for porridge and traditional beer across much of Africa.']],
      hist: 'Domesticated in Africa thousands of years ago.', bible: { refs: [], note: 'Sorghum is not clearly named in the Bible.' },
      prep: 'Cook as porridge.', ext: 'Not used on skin.', cook: 'Porridge, flatbreads, malt for beer.',
      ev: ['Modern science', 'Gluten-free and high in fibre.'], tox: 'Safe.', skin: 'None.', eat: 'Fine.', preg: 'Fine.', env: 'Climate-resilient crop.', src: []
    }),
    I('maize', '🌽', 'Maize (corn)', 'Zea mays', 'Grains', 'grain', {
      part: 'Kernels.', where: 'Native to Mexico. A staple across Africa since the 1500s.', buy: 'Everywhere.', grow: 'Yes. Warm-season crop.', names: [['mealie', 'South African English name for maize']],
      idn: 'Tall grass with a cob wrapped in husks.',
      culture: [['Documented', 'Maize meal porridge (pap, ugali, sadza) is a staple across southern and eastern Africa.']],
      hist: 'Domesticated in Mexico about 9,000 years ago.', bible: { refs: [], note: 'Maize is from the Americas and is not in the Bible. Some old English translations use “corn” to mean grain in general.' },
      prep: 'Boil maize meal into pap.', ext: 'Not used on skin.', cook: 'Pap, bread, chips.',
      ev: ['Modern science', 'Mouldy maize can contain aflatoxin; store dry.'], tox: 'Mouldy grain can be dangerous.', skin: 'None.', eat: 'Fine.', preg: 'Fine.', env: 'Water-intensive.', src: []
    }),

    /* TREES AND INDIGENOUS BOTANICALS */
    I('rooibos', '🍃', 'Rooibos', 'Aspalathus linearis', 'African botanicals', 'sprig', {
      part: 'Leaves and fine stems.', where: 'Cederberg region of the Western Cape, South Africa. Endemic.', buy: 'Supermarkets.', grow: 'Grown commercially in the Cederberg. Not a general garden plant.', names: [['rooibos', 'Afrikaans for “red bush”']],
      idn: 'A shrub with needle-like leaves that is oxidised to red-brown for tea.',
      culture: [['Documented', 'Long associated with the Khoisan people of the region. Commercial cultivation began in the 20th century.']],
      hist: 'A signature South African product.', bible: { refs: [], note: 'Rooibos is from South Africa and not in the Bible.' },
      prep: 'Steep 1 tea bag or a teaspoon of leaf in hot water for 5–7 minutes.', ext: 'Cooled tea is used in some skin routines; evidence is limited.', cook: 'Tea, baking.',
      ev: ['Modern science', 'Caffeine-free, with antioxidants. Evidence for health effects is limited.'],
      tox: 'Safe in normal amounts.', skin: 'Low risk.', eat: 'Fine.', preg: 'Generally considered fine as a tea.', env: 'Support sustainable producers.', src: [S_SANBI]
    }),
    I('buchu', '🍃', 'Buchu', 'Agathosma betulina (round-leaf buchu) and A. crenulata', 'African botanicals', 'sprig', {
      part: 'Leaves.', where: 'Fynbos of the Western Cape, South Africa.', buy: 'Pharmacies and herb shops (cultivated).', grow: 'Grown commercially. Wild harvest is regulated.', names: [['boegoe', 'Afrikaans name']],
      idn: 'Small, aromatic, leathery leaves with oil glands, on a small shrub.',
      culture: [['Documented', 'Used by the Khoi and San peoples. Early Cape colonists adopted it in brandy tinctures and teas.']],
      hist: 'Exported from the Cape since the 18th century.', bible: { refs: [], note: 'Buchu is from South Africa and not in the Bible.' },
      prep: 'Traditional teas and tinctures. Buy from a reputable pharmacy.', ext: 'Not recommended undiluted.', cook: 'Small amounts in tea.',
      ev: ['Modern science', 'Traditional use for urinary complaints; there is no reliable clinical evidence.'],
      tox: 'Pulegone in some buchu oils can be toxic. Do not use concentrated oils.', skin: 'May irritate.', eat: 'Only in small tea amounts.', preg: 'Avoid.', env: 'Do not wild-harvest; buy cultivated product.', src: [S_SANBI]
    }),
    I('baobab', '🌳', 'Baobab', 'Adansonia digitata', 'African botanicals', 'tree', {
      part: 'Fruit pulp, seeds, leaves.', where: 'Savannas of sub-Saharan Africa, including Limpopo.', buy: 'Health shops (baobab powder); markets.', grow: 'Grows very slowly; thrives in hot, frost-free areas.', names: [['isimuhu', 'isiZulu name for the baobab, though it is rare in Zulu-speaking areas; confirm with local speakers'], ['kremetart', 'Afrikaans name (“cream-of-tartar tree”)']],
      idn: 'Huge swollen trunk, branches like roots, large white flowers, velvety hanging fruit.',
      culture: [['Documented', 'The tree is called the “tree of life” in popular descriptions, since it stores water and gives food.']],
      hist: 'Some trees are over 1,000 years old.', bible: { refs: [], note: 'Baobab is not named in the Bible.' },
      prep: 'Mix the powder into water, juice or yoghurt.', ext: 'Baobab oil is used in cosmetics.', cook: 'Smoothies, drinks.',
      ev: ['Modern science', 'The pulp is high in vitamin C and fibre.'],
      tox: 'Safe as a food.', skin: 'Low risk.', eat: 'Fine.', preg: 'Fine as food.', env: 'Protected in some areas. Do not harvest from wild trees without permission.', src: [S_SANBI]
    }),
    I('marula', '🌳', 'Marula', 'Sclerocarya birrea', 'African botanicals', 'tree', {
      part: 'Fruit, kernel, oil, bark.', where: 'Savanna regions of southern Africa.', buy: 'Markets, shops (marula oil, Amarula cream liqueur).', grow: 'Yes in frost-free areas.', names: [['morula', 'Sesotho/Setswana name'], ['umganu', 'isiZulu name']],
      idn: 'A deciduous tree with a grey mottled trunk, yellow plum-sized fruit with a strong scent.',
      culture: [['Documented', 'The fruit and its kernels are a traditional food, and marula beer is made in southern Africa.']],
      hist: 'A major traditional food tree.', bible: { refs: [], note: 'Marula is not named in the Bible.' },
      prep: 'Eat the fruit; extract oil from kernels.', ext: 'Marula oil is used as a moisturiser.', cook: 'Jams, drinks, kernels.',
      ev: ['Modern science', 'The oil is rich in oleic acid.'], tox: 'Safe as food.', skin: 'Rare allergy.', eat: 'Fine.', preg: 'Fine as food.', env: 'Protected in some areas; harvest only fallen fruit.', src: [S_SANBI]
    }),
    I('moringa', '🍃', 'Moringa', 'Moringa oleifera', 'African botanicals', 'sprig', {
      part: 'Leaves, pods, seeds.', where: 'Native to India; widely grown across tropical Africa.', buy: 'Health shops, markets.', grow: 'Yes. Fast-growing; frost-tender.', names: [],
      idn: 'Feathery, small, compound leaves; long drumstick-like pods.',
      culture: [['Documented', 'Leaves are eaten as vegetables in many tropical countries.']],
      hist: 'Spread from India across the tropics.', bible: { refs: [], note: 'Moringa is not named in the Bible.' },
      prep: 'Cook the leaves like spinach, or dry and powder.', ext: 'Moringa oil is used in cosmetics.', cook: 'Soups, stews, powders.',
      ev: ['Modern science', 'The leaves are nutritious, but claims of cures are not supported.'],
      tox: 'Roots and bark can be toxic. Use only leaves and pods.', skin: 'Low risk.', eat: 'Leaves are fine.', preg: 'Avoid roots, bark and extracts.', env: 'Easy to grow.', src: [S_NIH]
    }),
    I('wormwood', '🍃', 'African wormwood', 'Artemisia afra', 'African botanicals', 'sprig', {
      part: 'Leaves.', where: 'Eastern and southern Africa.', buy: 'Traditional medicine markets and herbal shops.', grow: 'Yes. Hardy in many gardens.', names: [['umhlonyane', 'isiZulu name'], ['wilde-als', 'Afrikaans name']],
      idn: 'Grey-green, finely divided, feathery leaves with a strong bitter smell. Easily confused with other Artemisia and unrelated plants; confirm with a trained person.',
      culture: [['Documented', 'A widely used traditional remedy in southern Africa, mostly for colds and coughs.']],
      hist: 'Widely recorded in southern African ethnobotany.', bible: { refs: [], note: 'African wormwood is not the “wormwood” of the Bible, which is a different Artemisia species.' },
      prep: 'Traditional infusions are used, but dose and strength vary a great deal.', ext: 'Not recommended without guidance.', cook: 'Not a food.',
      ev: ['Modern science', 'Laboratory work shows some activity, but clinical evidence in people is lacking. It is NOT a proven malaria treatment; A. annua is a separate plant.'],
      tox: 'Contains thujone and other compounds that can be toxic in large amounts. Do not give to children.', skin: 'May irritate.', eat: 'Do not take it without advice from a knowledgeable person.', preg: 'Avoid.', env: 'Do not over-harvest wild plants.', src: [S_SANBI]
    }),
    I('shea', '🌳', 'Shea', 'Vitellaria paradoxa', 'African botanicals', 'tree', {
      part: 'Nut butter.', where: 'The shea belt of West and Central Africa, from Senegal to Uganda.', buy: 'Pharmacies, markets, cosmetic suppliers.', grow: 'Grows wild in savanna; slow to fruit (15–20 years).', names: [['karité', 'French name used across West Africa']],
      idn: 'A savanna tree with thick, deeply furrowed bark and plum-like fruit with a large nut.',
      culture: [['Documented', 'Shea butter is traditionally made by women’s groups and is important to local economies in West Africa.']],
      hist: 'Used for centuries as food, medicine and skin balm.', bible: { refs: [], note: 'Shea is not named in the Bible.' },
      prep: 'Warm a little between the hands and apply.', ext: 'A moisturiser for skin and hair.', cook: 'Cooking fat in some regions.',
      ev: ['Modern science', 'A good emollient, helpful for dry skin.'], tox: 'Safe.', skin: 'Tree nut allergy is rare but possible.', eat: 'Fine.', preg: 'Fine.', env: 'Buy fair trade if possible.', src: []
    }),

    /* MINERALS */
    I('salt', '🧂', 'Sea salt', 'Mineral: sodium chloride (NaCl)', 'Minerals', 'crystal', {
      part: 'Crystals from evaporated seawater.', where: 'Coastlines worldwide.', buy: 'Supermarkets.', grow: 'Not a plant.', names: [],
      idn: 'White or grey crystals, from fine to coarse.',
      culture: [['Documented history', 'Salt preserved food and was traded as a valuable good across the Sahara and the Roman Empire.'], ['Belief', 'In several European folk traditions, throwing spilt salt over the shoulder is believed to ward off bad luck. This is a belief with no evidence of effect.']],
      hist: 'The word “salary” is commonly linked to Latin salarium, connected with salt.', bible: { refs: ['matthew.5.13', 'leviticus.2.13', 'numbers.18.19', 'colossians.4.6'], note: 'Salt is used as a picture of lasting covenants and of influence, “the salt of the earth”. These verses are about meaning, not a ritual formula.' },
      prep: 'Use as seasoning.', ext: 'Warm salt baths are a traditional comfort practice and some people with eczema or aching muscles find them soothing. Do not use on broken or very sensitive skin.', cook: 'Seasoning, curing, pickling.',
      ev: ['Modern science', 'Salt is essential in small amounts. Too much raises blood pressure. Salt baths do not remove toxins or curses.'],
      tox: 'Swallowing large amounts of salt, including bath salt water, can be dangerous.', skin: 'Can sting open skin and dry skin.', eat: 'Keep to under about 5 g of salt per day (WHO guidance).', preg: 'Fine in normal amounts.', env: 'Do not bathe babies in salt water.', src: ['World Health Organization sodium guidance (who.int)']
    })
  ];

  var CATS = ['Spices', 'Leaves', 'Roots', 'Flowers', 'Seeds', 'Fruits', 'Sweeteners', 'Resins', 'Grains', 'African botanicals', 'Minerals'];

  window.OrisonIngredients = { ITEMS: ITEMS, CATS: CATS, NOTE_GEN: NOTE_GEN };
})();
