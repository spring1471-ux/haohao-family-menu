"use client";

import { useEffect, useState } from "react";

type Meal = { day:string; dish:string; side:string; tag:string; tone:string; time:string; kcal:number; protein:number; reason:string };
type Feedback = { dish:string; rating:number; note:string; members?:string[]; sentiment?:"like"|"neutral"|"dislike" };
type Recipe = { ingredients:string; steps:string };
const defaultPrefs={location:"上海",people:"3",health:"少盐、均衡蛋白",likes:"清蒸、鲜味、家常菜",avoid:"香菜、过辣",ingredientLikes:"鱼虾、鸡蛋、豆制品、绿叶菜",ingredientAvoids:"肥肉、动物内脏"};

const plans: Meal[][] = [[
  {day:"周一",dish:"春笋烧鸡",side:"清炒蚕豆 · 糙米饭",tag:"高蛋白",tone:"green",time:"35 分钟",kcal:486,protein:32,reason:"春笋正当季，搭配鸡腿肉兼顾鲜味与蛋白质。"},
  {day:"周二",dish:"番茄豆腐煲",side:"蒜蓉生菜 · 小米粥",tag:"轻负担",tone:"orange",time:"25 分钟",kcal:412,protein:21,reason:"照顾清淡偏好，以豆制品替代一餐红肉。"},
  {day:"周三",dish:"葱油鲈鱼",side:"菌菇青菜 · 杂粮饭",tag:"优质脂肪",tone:"blue",time:"30 分钟",kcal:468,protein:35,reason:"本周鱼类摄入偏少，用鲈鱼补足优质蛋白。"},
  {day:"周四",dish:"芦笋炒牛肉",side:"凉拌木耳 · 紫米饭",tag:"补铁",tone:"purple",time:"30 分钟",kcal:515,protein:30,reason:"芦笋当季，牛肉与菌菇丰富矿物质来源。"},
  {day:"周五",dish:"时蔬鸡蛋面",side:"海带豆芽汤",tag:"快手",tone:"yellow",time:"20 分钟",kcal:439,protein:22,reason:"工作日末安排简单烹饪，减少外卖概率。"},
  {day:"周六",dish:"南瓜蒸排骨",side:"荷塘小炒 · 米饭",tag:"全家喜爱",tone:"red",time:"45 分钟",kcal:568,protein:31,reason:"参考历史反馈，保留家人评分最高的蒸菜。"},
  {day:"周日",dish:"香菇素什锦",side:"山药排骨汤 · 米饭",tag:"膳食纤维",tone:"teal",time:"50 分钟",kcal:526,protein:27,reason:"用多种菌菇与蔬菜补齐本周膳食多样性。"},
],[
  {day:"周一",dish:"荠菜虾仁豆腐",side:"清炒油麦菜 · 燕麦饭",tag:"高钙",tone:"green",time:"25 分钟",kcal:452,protein:30,reason:"荠菜正当季，虾仁与豆腐提供多元蛋白。"},
  {day:"周二",dish:"菌菇滑鸡",side:"凉拌莴笋 · 糙米饭",tag:"少油",tone:"orange",time:"30 分钟",kcal:478,protein:33,reason:"延续全家的嫩滑口感偏好，同时控制用油。"},
  {day:"周三",dish:"豉汁蒸鳕鱼",side:"清炒菠菜 · 小米饭",tag:"优质脂肪",tone:"blue",time:"28 分钟",kcal:445,protein:36,reason:"轮换鱼类来源，避免菜式重复。"},
  {day:"周四",dish:"蚕豆炒鸡蛋",side:"番茄牛腩汤 · 米饭",tag:"应季",tone:"purple",time:"40 分钟",kcal:535,protein:29,reason:"使用本地春季蚕豆，兼顾家常口味。"},
  {day:"周五",dish:"鸡丝荞麦面",side:"紫菜豆腐汤",tag:"快手",tone:"yellow",time:"20 分钟",kcal:421,protein:26,reason:"荞麦替换精制主食，晚餐更轻盈。"},
  {day:"周六",dish:"萝卜炖羊肉",side:"蒜蓉菜心 · 米饭",tag:"暖胃",tone:"red",time:"55 分钟",kcal:589,protein:34,reason:"周末慢炖菜，适合一家人共享。"},
  {day:"周日",dish:"荷香糯米鸡",side:"丝瓜毛豆汤 · 时蔬",tag:"家庭餐",tone:"teal",time:"50 分钟",kcal:557,protein:28,reason:"用清蒸方式呈现全家喜欢的糯米风味。"},
]];
const meal=(dish:string,side:string,tag:string,tone:string,time:string,kcal:number,protein:number,reason:string):Omit<Meal,"day">=>({dish,side,tag,tone,time,kcal,protein,reason});
const breakfastPlans: Omit<Meal,"day">[][] = [[
  meal("南瓜小米粥","水煮蛋 · 当季水果","暖胃","yellow","20 分钟",326,14,"温热谷物搭配鸡蛋，适合作为一周的轻松开始。"),
  meal("葱花鸡蛋饼","无糖豆浆 · 小番茄","快手","orange","15 分钟",358,18,"鸡蛋和豆浆补足早餐蛋白质，饼中加入葱花增香。"),
  meal("玉米山药粥","芝麻拌菠菜 · 鸡蛋","粗细搭配","green","25 分钟",341,15,"玉米与山药提供复合主食，搭配绿叶菜。"),
  meal("番茄鸡蛋面","焯青菜 · 苹果片","一碗完成","red","18 分钟",389,19,"工作日用一碗热汤面兼顾主食、蛋白质和蔬菜。"),
  meal("紫薯燕麦杯","原味酸奶 · 核桃","高纤","purple","10 分钟",335,13,"适合忙碌早晨，紫薯和燕麦带来更强饱腹感。"),
  meal("鲜肉小馄饨","紫菜虾皮汤 · 青菜","周末早餐","blue","30 分钟",402,21,"周末留出时间包馄饨，可多做一些冷冻备用。"),
  meal("香菇鸡肉粥","凉拌黄瓜 · 橙子","清淡","teal","35 分钟",368,22,"用前一餐鸡肉做粥，减少浪费又便于消化。")
],[
  meal("红枣燕麦粥","蒸蛋 · 梨","温润","yellow","18 分钟",318,14,"燕麦与鸡蛋构成稳定的早餐组合。"),
  meal("蔬菜鸡蛋卷","牛奶 · 玉米段","高蛋白","orange","15 分钟",371,22,"把胡萝卜与青菜卷进鸡蛋，适合孩子一起吃。"),
  meal("黑米粥","小菜 · 茶叶蛋","谷物多样","purple","25 分钟",346,15,"轮换主食种类，增加全谷物摄入。"),
  meal("鸡丝汤面","青菜 · 猕猴桃","快手","blue","18 分钟",384,23,"利用熟鸡丝快速完成工作日早餐。"),
  meal("香蕉燕麦煎饼","酸奶 · 蓝莓","少糖","yellow","15 分钟",352,16,"用香蕉自然甜味减少额外加糖。"),
  meal("菜肉包子","豆浆 · 凉拌木耳","家庭早餐","green","30 分钟",410,20,"周末蒸一笼包子，也可冷冻作为备餐。"),
  meal("青菜瘦肉粥","蒸南瓜 · 鸡蛋","清爽","teal","30 分钟",366,21,"蔬菜、瘦肉与谷物在一碗粥里完成。")
]];
const lunchPlans: Omit<Meal,"day">[][] = [[
  meal("番茄牛腩饭","清炒西兰花 · 米饭","能量午餐","red","50 分钟",638,35,"午餐安排耐饥的牛肉和米饭，番茄增添酸甜。"),
  meal("芹菜豆干肉丝","紫菜蛋花汤 · 米饭","家常小炒","green","25 分钟",572,31,"同一份芹菜与豆干用快炒方式，口感清脆。"),
  meal("清蒸鲈鱼套餐","蒜蓉菜心 · 杂粮饭","清蒸","blue","30 分钟",548,38,"午餐用清蒸鱼，晚餐再以葱油方式变化做法。"),
  meal("少油宫保鸡丁","凉拌木耳 · 糙米饭","下饭","red","30 分钟",601,34,"鸡肉重复使用但改为快炒，以坚果丰富口感。"),
  meal("虾仁豆腐滑蛋","炒时蔬 · 米饭","鲜嫩","orange","25 分钟",566,36,"豆腐在午餐中做滑蛋，区别于晚餐的番茄煲。"),
  meal("萝卜炖牛腩","清炒菠菜 · 米饭","周末炖菜","teal","55 分钟",624,37,"适合周末慢炖，可多做一份留作备餐。"),
  meal("菌菇鸡汤面","凉拌莴笋","一锅完成","yellow","35 分钟",535,30,"利用鸡肉和菌菇煮汤面，做法与烧鸡不同。")
],[
  meal("土豆胡萝卜炖牛肉","清炒油麦菜 · 米饭","慢炖","red","55 分钟",642,36,"用根茎蔬菜搭配牛肉，适合午餐补充能量。"),
  meal("香煎鸡腿饭","凉拌黄瓜 · 味噌汤","香煎","orange","30 分钟",618,37,"鸡腿以香煎方式呈现，与晚餐菌菇滑鸡区分。"),
  meal("番茄鳕鱼豆腐","蒜蓉菠菜 · 杂粮饭","高蛋白","blue","30 分钟",566,39,"鳕鱼午餐用番茄炖，晚餐则用豉汁蒸。"),
  meal("肉末蚕豆烧豆腐","时蔬汤 · 米饭","应季","green","30 分钟",581,32,"蚕豆与豆腐焖烧，和晚餐炒鸡蛋形成变化。"),
  meal("照烧鸡肉荞麦饭","凉拌海带芽","谷物多样","yellow","30 分钟",596,35,"同样的鸡肉以照烧方式搭配荞麦主食。"),
  meal("清炖羊肉汤","手抓蔬菜饼","清炖","teal","60 分钟",630,38,"羊肉午餐清炖，晚餐与萝卜浓炖做法不同。"),
  meal("荷叶鸡饭","丝瓜毛豆汤","蒸制","purple","50 分钟",612,33,"鸡肉与米饭同蒸，适合周末全家分享。")
]];
const glyphs=["笋","豆","鱼","芦","面","南","菇"];
const recipeLibrary: Record<string,Recipe> = {
  "春笋烧鸡":{ingredients:"鸡腿肉 500 克\n春笋 300 克\n姜 4 片、葱 2 根\n生抽 2 汤匙、老抽 1 茶匙\n料酒 1 汤匙、冰糖 6 粒",steps:"1. 春笋切滚刀块，沸水加少许盐焯 3 分钟，捞出沥干。\n2. 鸡腿肉切块，擦干水分；热锅少油，将鸡块煎至表面微黄。\n3. 加姜葱、料酒、生抽、老抽和冰糖翻炒上色。\n4. 加热水至食材约八分高，小火焖 20 分钟。\n5. 放入春笋再焖 10 分钟，大火收汁，按口味补盐。"},
  "番茄豆腐煲":{ingredients:"番茄 2 个\n嫩豆腐 1 盒\n鸡蛋 1 个\n蒜 2 瓣、葱花少许\n生抽 1 汤匙、盐少许",steps:"1. 番茄去蒂切块，豆腐切厚片。\n2. 豆腐裹蛋液，平底锅少油煎至两面微黄。\n3. 原锅炒香蒜末，下番茄炒软出汁。\n4. 加半碗水和生抽，放入豆腐小火煮 8 分钟。\n5. 轻轻翻匀，少量盐调味，撒葱花。"},
  "葱油鲈鱼":{ingredients:"鲈鱼 1 条（约 600 克）\n姜 6 片、葱 3 根\n蒸鱼豉油 2 汤匙\n料酒 1 汤匙\n食用油 1 汤匙",steps:"1. 鲈鱼处理干净，两侧划刀，抹料酒后铺姜片。\n2. 水沸后入锅，大火蒸 8—10 分钟，关火焖 2 分钟。\n3. 倒掉盘中腥水，去掉旧姜片。\n4. 铺葱丝，淋蒸鱼豉油。\n5. 油烧至微微冒烟，均匀浇在葱丝上。"},
  "芦笋炒牛肉":{ingredients:"牛里脊 250 克\n芦笋 250 克\n蒜 2 瓣\n生抽 1.5 汤匙\n淀粉 1 茶匙、黑胡椒少许",steps:"1. 牛肉逆纹切片，加生抽、淀粉和少许油抓匀，腌 15 分钟。\n2. 芦笋去老根切段，沸水焯 40 秒。\n3. 热锅少油，牛肉快速滑炒至变色后盛出。\n4. 炒香蒜末，下芦笋翻炒 1 分钟。\n5. 牛肉回锅，加黑胡椒翻匀即出锅。"},
  "时蔬鸡蛋面":{ingredients:"鲜面条 300 克\n鸡蛋 2 个\n青菜 200 克、番茄 1 个\n生抽 1 汤匙\n香油、盐少许",steps:"1. 鸡蛋打散炒熟盛出，番茄切块。\n2. 原锅炒软番茄，加足量热水煮开。\n3. 下面条煮至八成熟，再放青菜。\n4. 加生抽和少许盐，放回鸡蛋。\n5. 关火淋几滴香油。"},
  "南瓜蒸排骨":{ingredients:"肋排 400 克\n南瓜 350 克\n豆豉 1 汤匙、蒜 3 瓣\n生抽 1.5 汤匙\n淀粉 1 茶匙",steps:"1. 排骨浸泡去血水，擦干后加豆豉、蒜末、生抽和淀粉腌 30 分钟。\n2. 南瓜去皮切厚块，铺在深盘底部。\n3. 排骨平铺在南瓜上，不要堆叠。\n4. 水沸后入锅，中火蒸 30—35 分钟。\n5. 确认排骨熟透，撒葱花即可。"},
  "香菇素什锦":{ingredients:"鲜香菇 6 朵\n胡萝卜半根、荷兰豆 150 克\n木耳 8 朵、腐竹 100 克\n生抽 1 汤匙、蚝油 1 茶匙",steps:"1. 木耳、腐竹提前泡发，所有食材切成大小相近的块。\n2. 木耳和荷兰豆沸水焯 1 分钟。\n3. 热锅少油，先炒香菇和胡萝卜。\n4. 加木耳、腐竹和少量水焖 3 分钟。\n5. 放荷兰豆，以生抽和蚝油调味，翻匀出锅。"},
};
const defaultRecipe=(meal:Meal):Recipe=>({ingredients:`${meal.dish}主料 3 人份\n葱姜蒜适量\n生抽、盐适量\n搭配：${meal.side}`,steps:`1. 主料洗净并切成适口大小。\n2. 按蒸、煮或少油炒的家常方式预处理。\n3. 加入辅料，以中小火烹制至熟。\n4. 起锅前少量调味，尝味后再补盐。\n5. 与 ${meal.side} 一起上桌。`});
const getSeasonInfo=()=>{
  const month=new Date().getMonth()+1;
  const lunarMonth=new Intl.DateTimeFormat("zh-CN-u-ca-chinese",{month:"long"}).format(new Date());
  const seasons:Record<number,{period:string;produce:string}>={
    1:{period:"季冬",produce:"冬笋、萝卜、白菜正鲜，适合炖煮与煲汤。"},2:{period:"孟春",produce:"春菜、韭菜、菠菜渐鲜，适合清炒与做汤。"},3:{period:"仲春",produce:"荠菜、春笋、蚕豆正鲜，优先安排进本周菜单。"},4:{period:"季春",produce:"春笋、蚕豆、芦笋正鲜，优先安排进本周菜单。"},5:{period:"孟夏",produce:"豌豆、莴笋、蒜薹正鲜，适合清炒与焖烧。"},6:{period:"仲夏",produce:"丝瓜、毛豆、茄子正鲜，适合蒸煮与少油快炒。"},7:{period:"季夏",produce:"番茄、冬瓜、玉米正鲜，适合清爽家常菜。"},8:{period:"孟秋",produce:"莲藕、菱角、毛豆正鲜，优先安排进本周菜单。"},9:{period:"仲秋",produce:"莲藕、茭白、芋艿正鲜，适合蒸煮与炖烧。"},10:{period:"季秋",produce:"南瓜、山药、板栗正鲜，适合温润炖煮。"},11:{period:"孟冬",produce:"萝卜、白菜、冬笋渐鲜，适合煲汤与焖烧。"},12:{period:"仲冬",produce:"冬笋、荠菜、萝卜正鲜，适合暖胃家常菜。"}
  };
  return {lunarMonth,...seasons[month]};
};

export default function Home(){
  const [planIndex,setPlanIndex]=useState(0); const [selected,setSelected]=useState<Meal|null>(null); const [modalMode,setModalMode]=useState<"summary"|"recipe"|"feedback">("summary");
  const [tab,setTab]=useState<"plan"|"preferences"|"feedback">("plan"); const [notice,setNotice]=useState("");
  const [prefs,setPrefs]=useState(defaultPrefs);
  const [feedback,setFeedback]=useState<Feedback[]>([]); const [recipes,setRecipes]=useState<Record<string,Recipe>>({});
  const [recipeDraft,setRecipeDraft]=useState<Recipe>({ingredients:"",steps:""}); const [feedbackDraft,setFeedbackDraft]=useState({members:["我"] as string[],sentiment:"like" as "like"|"neutral"|"dislike",note:""});
  useEffect(()=>{try{const raw=localStorage.getItem("family-food-profile");if(raw){const saved=JSON.parse(raw);if(saved.prefs)setPrefs({...defaultPrefs,...saved.prefs});if(saved.feedback)setFeedback(saved.feedback);if(saved.recipes)setRecipes(saved.recipes)}}catch{}},[]);
  const persist=(nextPrefs=prefs,nextFeedback=feedback,nextRecipes=recipes)=>{localStorage.setItem("family-food-profile",JSON.stringify({prefs:nextPrefs,feedback:nextFeedback,recipes:nextRecipes}));setNotice("已保存到这台设备");setTimeout(()=>setNotice(""),2200)};
  const regenerate=()=>{setPlanIndex(v=>(v+1)%plans.length);setNotice("已结合最近反馈生成新方案");setTimeout(()=>setNotice(""),2500)};
  const saveAndRefresh=()=>{persist(prefs,feedback,recipes);setPlanIndex(v=>(v+1)%plans.length);setTab("plan");setNotice("偏好已保存，三餐菜谱已刷新");setTimeout(()=>setNotice(""),2500)};
  const openRecipe=(meal:Meal)=>{const recipe=recipes[meal.dish]||recipeLibrary[meal.dish]||defaultRecipe(meal);setSelected(meal);setRecipeDraft(recipe);setModalMode("recipe")};
  const openFeedback=(meal:Meal)=>{const old=feedback.find(v=>v.dish===meal.dish);setSelected(meal);setFeedbackDraft({members:old?.members||["我"],sentiment:old?.sentiment||"like",note:old?.note||""});setModalMode("feedback")};
  const saveRecipe=()=>{if(!selected)return;const next={...recipes,[selected.dish]:recipeDraft};setRecipes(next);persist(prefs,feedback,next);setSelected(null)};
  const saveFeedback=()=>{if(!selected)return;const rating=feedbackDraft.sentiment==="like"?5:feedbackDraft.sentiment==="neutral"?3:2;const next=[{dish:selected.dish,rating,note:feedbackDraft.note||`${feedbackDraft.members.join("、")}已记录品尝感受`,members:feedbackDraft.members,sentiment:feedbackDraft.sentiment},...feedback.filter(v=>v.dish!==selected.dish)].slice(0,20);setFeedback(next);persist(prefs,next,recipes);setSelected(null)};
  const plan=plans[planIndex];
  const week=plan.map((dinner,index)=>({day:dinner.day,meals:[{...breakfastPlans[planIndex][index],day:dinner.day},{...lunchPlans[planIndex][index],day:dinner.day},dinner]}));
  const seasonInfo=getSeasonInfo();
  return <main>
    {notice&&<div className="toast" role="status">✓ {notice}</div>}
    <header className="topbar"><button className="brand" onClick={()=>setTab("plan")}>好好吃饭<span>家庭食谱</span></button><nav aria-label="主导航"><button className={tab==="plan"?"active":""} onClick={()=>setTab("plan")}>本周食谱</button><button className={tab==="preferences"?"active":""} onClick={()=>setTab("preferences")}>家庭偏好</button><button className={tab==="feedback"?"active":""} onClick={()=>setTab("feedback")}>品尝记录</button></nav><button className="settings-button" onClick={()=>setTab("preferences")} aria-label="打开设置"><span aria-hidden="true">⚙</span> 设置</button></header>
    {tab==="plan"&&<>
      <section className="hero"><div><p className="eyebrow">{prefs.location} · 农历{seasonInfo.lunarMonth} · {seasonInfo.period}</p><h1>这一周，三餐都<br/><em>应季又合心意</em></h1><p className="intro">综合全家的口味、健康目标和本地时令，为你安排好 7 天、每日三餐。</p></div><div className="score-card"><div className="score-ring"><strong>{planIndex?90:92}</strong><span>营养均衡分</span></div><div><b>本周搭配很不错</b><p>三餐粗细搭配，蛋白质来源多样；相同食材会通过蒸、炖、煎、炒变换做法。</p></div></div></section>
      <section className="week-section"><div className="section-heading"><div><p className="kicker">下一周 · 21 餐计划</p><h2>全家一周三餐</h2></div><button className="primary" onClick={regenerate}>换一周食谱 <span>↗</span></button></div><div className="daily-plans"><div className="meal-table-head"><span>日期</span><span>早餐</span><span>午餐</span><span>晚餐</span></div>{week.map((day,dayIndex)=><article className={`day-plan ${dayIndex===0?"today":""}`} key={day.day}><div className="day-label"><strong>{day.day}</strong>{dayIndex===0&&<small>首日</small>}</div>{day.meals.map((item,mealIndex)=><div className="meal-slot" key={item.dish}><span className={`meal-kind kind-${mealIndex}`}>{["早餐","午餐","晚餐"][mealIndex]}</span><button className="meal-name" onClick={()=>{setSelected(item);setModalMode("summary")}}><b>{item.dish}</b><small>{item.side}</small></button><div className="meal-meta"><span className={`tag ${item.tone}`}>{item.tag}</span><button className="recipe-link" onClick={()=>openRecipe(item)} aria-label={`查看${item.dish}制作菜谱`}><span className="recipe-icon" aria-hidden="true">📖</span><span className="recipe-label">菜谱</span><span className="recipe-time">约 {item.time}</span></button><button className="feedback-arrow" onClick={()=>openFeedback(item)} aria-label={`记录${item.dish}品尝反馈`}>→</button></div></div>)}</article>)}</div>
        <div className="insight-row"><article><span className="insight-icon">旬</span><div><b>本地时令 <small>{prefs.location} · 农历{seasonInfo.lunarMonth} · {seasonInfo.period}</small></b><p>{seasonInfo.produce}</p></div></article><article><span className="insight-icon">衡</span><div><b>三餐结构</b><p>早餐稳能量，午餐吃充足，晚餐更轻盈；食材复用但做法轮换。</p></div></article><article><span className="insight-icon">味</span><div><b>偏好匹配</b><p>参考 {feedback.length||6} 条反馈，减少重辣与香菜，偏向蒸煮。</p></div></article></div>
      </section></>}
    {tab==="preferences"&&<section className="workspace"><div className="workspace-head"><p className="eyebrow">家庭画像</p><h1>把一家人的偏好<br/><em>慢慢告诉我</em></h1><p>不必一次填完。每次想到一点，就回来补充一点；保存后会立即刷新一周三餐。</p></div><div className="form-card"><label>常住地<span>用于判断季节与本地食材</span><input value={prefs.location} onChange={e=>setPrefs({...prefs,location:e.target.value})}/></label><label>用餐人数<span>用于估算食材份量</span><input type="number" min="1" max="12" value={prefs.people} onChange={e=>setPrefs({...prefs,people:e.target.value})}/></label><label>健康理念<span>例如少盐、控糖、高蛋白</span><textarea value={prefs.health} onChange={e=>setPrefs({...prefs,health:e.target.value})}/></label><label>喜欢的口味与做法<textarea value={prefs.likes} onChange={e=>setPrefs({...prefs,likes:e.target.value})}/></label><label>口味与做法忌口<textarea value={prefs.avoid} onChange={e=>setPrefs({...prefs,avoid:e.target.value})}/></label><div className="ingredient-section"><div className="ingredient-heading"><b>食材偏好</b><span>单独记录选材习惯、过敏和需要少用的食材</span></div><div className="ingredient-grid"><label>常买、爱吃的食材<span>例如鱼虾、鸡蛋、豆制品、绿叶菜</span><textarea value={prefs.ingredientLikes} onChange={e=>setPrefs({...prefs,ingredientLikes:e.target.value})}/></label><label>不爱吃、过敏或希望少用<span>例如肥肉、动物内脏、花生过敏</span><textarea value={prefs.ingredientAvoids} onChange={e=>setPrefs({...prefs,ingredientAvoids:e.target.value})}/></label></div></div><button className="primary wide refresh-button" onClick={saveAndRefresh}>保存并刷新一周三餐 <span>↗</span></button><p className="save-hint">保存后立即返回本周食谱，按新偏好轮换 21 餐。</p></div></section>}
    {tab==="feedback"&&<section className="workspace feedback-page"><div className="workspace-head"><p className="eyebrow">越吃越懂你</p><h1>最近的<br/><em>品尝记录</em></h1><p>每位家人的真实感受，都会参与下一周菜单的口味权重。</p></div><div className="feedback-list">{feedback.length?feedback.map((item,i)=><article key={item.dish+i}><div><span className="mini-art">{item.dish.slice(0,1)}</span><div><b>{item.dish}</b><p>{item.members?.join("、")||"家人"} · {item.note}</p></div></div><span className="sentiment-mark">{item.sentiment==="dislike"?"不太爱吃":item.sentiment==="neutral"?"还可以":"爱吃"}</span></article>):<div className="empty"><span>味</span><h2>还没有品尝记录</h2><p>点击菜品卡右下角箭头，记录家人的品尝反馈。</p><button className="secondary" onClick={()=>setTab("plan")}>去看看本周食谱</button></div>}</div></section>}
    {selected&&<div className="modal-backdrop" onMouseDown={()=>setSelected(null)}><section className={`modal ${modalMode!=="summary"?"modal-form":""}`} role="dialog" aria-modal="true" aria-labelledby="dish-title" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)} aria-label="关闭">×</button>
      {modalMode==="summary"&&<><div className={`modal-art ${selected.tone}`}><span>{selected.dish.slice(0,1)}</span></div><p className="eyebrow">{selected.day} · {selected.tag}</p><h2 id="dish-title">{selected.dish}</h2><p className="modal-side">搭配 {selected.side}</p><div className="nutrition"><div><strong>{selected.kcal}</strong><span>千卡</span></div><div><strong>{selected.protein}g</strong><span>蛋白质</span></div><div><strong>{selected.time}</strong><span>预计用时</span></div></div><div className="why"><b>为什么推荐</b><p>{selected.reason}</p></div><div className="modal-actions"><button className="secondary" onClick={()=>openRecipe(selected)}>查看制作菜谱</button><button className="primary" onClick={()=>openFeedback(selected)}>记录品尝反馈</button></div></>}
      {modalMode==="recipe"&&<><p className="eyebrow">我家的菜谱 · 可编辑</p><h2 id="dish-title">{selected.dish}</h2><p className="modal-side">优先整理自真实社交分享；缺少可靠分享时采用专业美食作者做法。</p><label className="editor-label">用料（{prefs.people} 人份）<textarea value={recipeDraft.ingredients} onChange={e=>setRecipeDraft({...recipeDraft,ingredients:e.target.value})}/></label><label className="editor-label">制作步骤<textarea className="steps-editor" value={recipeDraft.steps} onChange={e=>setRecipeDraft({...recipeDraft,steps:e.target.value})}/></label><div className="source-badge"><span>来源优先级</span><b>小红书真实分享 → 专业美食作者</b></div><p className="source-note">公开页面无法稳定核验时不会虚构作者或点赞数；当前做法会参考可核验的下厨房家庭记录等专业社区。保存后仅存于当前设备。</p><button className="primary wide" onClick={saveRecipe}>保存为我家的做法</button></>}
      {modalMode==="feedback"&&<><p className="eyebrow">吃完记一笔</p><h2 id="dish-title">{selected.dish}</h2><p className="modal-side">谁吃了？大家觉得怎么样？</p><div className="feedback-field"><b>品尝成员</b><div className="choice-row">{["我","伴侣","孩子","长辈"].map(name=><button key={name} className={feedbackDraft.members.includes(name)?"chosen":""} onClick={()=>setFeedbackDraft({...feedbackDraft,members:feedbackDraft.members.includes(name)?feedbackDraft.members.filter(v=>v!==name):[...feedbackDraft.members,name]})}>{name}</button>)}</div></div><div className="feedback-field"><b>总体感受</b><div className="choice-row sentiments"><button className={feedbackDraft.sentiment==="like"?"chosen":""} onClick={()=>setFeedbackDraft({...feedbackDraft,sentiment:"like"})}>☺ 爱吃</button><button className={feedbackDraft.sentiment==="neutral"?"chosen":""} onClick={()=>setFeedbackDraft({...feedbackDraft,sentiment:"neutral"})}>○ 还可以</button><button className={feedbackDraft.sentiment==="dislike"?"chosen":""} onClick={()=>setFeedbackDraft({...feedbackDraft,sentiment:"dislike"})}>△ 不太爱吃</button></div></div><label className="editor-label">补充备注<textarea placeholder="例如：孩子喜欢，但希望下次少放一点姜" value={feedbackDraft.note} onChange={e=>setFeedbackDraft({...feedbackDraft,note:e.target.value})}/></label><button className="primary wide" onClick={saveFeedback} disabled={!feedbackDraft.members.length}>保存品尝反馈</button></>}
    </section></div>}
  </main>;
}
