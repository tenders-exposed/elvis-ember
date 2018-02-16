import Service from '@ember/service';

const songs = [
  `500 Miles`,
  `Adam and Evil`,
  `After Loving You`,
  `"Ain't That Lovin' You, Baby"`,
  `All I Needed Was the Rain`,
  `All Shook Up`,
  `All That I Am`,
  `Allá en el Rancho Grande`,
  `Almost`,
  `Almost Always True`,
  `Almost in Love`,
  `Aloha 'Oe`,
  `"Alright, Okay, You Win"`,
  `Always on My Mind`,
  `Am I Ready`,
  `Amazing Grace`,
  `America the Beautiful`,
  `An American Trilogy`,
  `And I Love You So`,
  `And the Grass Won't Pay No Mind`,
  `Angel`,
  `Animal Instinct`,
  `Any Day Now`,
  `Any Way You Want Me (That's How I Will Be)`,
  `Anyone (Could Fall in Love with You)`,
  `Anyplace Is Paradise`,
  `Anything That's Part of You`,
  `Apron Strings`,
  `Are You Lonesome Tonight?`,
  `Are You Sincere`,
  `As Long As I Have You`,
  `Ask Me`,
  `Aubrey`,
  `Baby Let's Play House`,
  `Baby What You Want Me to Do`,
  `"Baby, If You'll Give Me All of Your Love"`,
  `Barefoot Ballad`,
  `Beach Boy Blues`,
  `Beach Shack`,
  `Because of Love`,
  `Beginner's Luck`,
  `Beyond the Bend`,
  `Beyond the Reef`,
  `Big Boots`,
  `Big Boss Man`,
  `A Big Hunk O' Love`,
  `"Big Love, Big Heartache"`,
  `"Bitter They Are, Harder They Fall"`,
  `Blessed Jesus (Hold My Hand)`,
  `Blowin' in the Wind`,
  `Blue Christmas`,
  `Blue Eyes Crying in the Rain`,
  `Blue Hawaii`,
  `Blue Moon of Kentucky`,
  `Blue Moon`,
  `Blue River`,
  `Blue Suede Shoes`,
  `Blueberry Hill`,
  `Bosom of Abraham`,
  `Bossa Nova Baby`,
  `"A Boy Like Me, A Girl Like You"`,
  `Bridge Over Troubled Water`,
  `Bringin' It Back`,
  `Britches`,
  `Brown Eyed Handsome Man`,
  `The Bullfighter Was a Lady`,
  `Burning Love`,
  `By and By`,
  `A Cane and a High Starched Collar`,
  `Can't Help Falling in Love`,
  `Carny Town`,
  `Catchin' On Fast`,
  `Cattle Call`,
  `Change of Habit`,
  `Charro`,
  `Chesay`,
  `"Cindy, Cindy"`,
  `City By Night`,
  `Clambake`,
  `Clean Up Your Own Backyard`,
  `The Climb`,
  `C'mon Everybody`,
  `Columbus Stockade Blues`,
  `Come Along`,
  `Come What May`,
  `Confidence`,
  `Cotton Candy Land`,
  `Cottonfields`,
  `Could I Fall in Love`,
  `Crawfish`,
  `Crazy Arms`,
  `Cross My Heart and Hope to Die`,
  `Crying in the Chapel`,
  `Dainty Little Moonbeams`,
  `Danny`,
  `Danny Boy`,
  `Dark Moon`,
  `Datin'`,
  `Didja' Ever`,
  `"Dirty, Dirty Feeling"`,
  `Dixieland Rock`,
  `Do Not Disturb`,
  `Do the Clam`,
  `Do the Vega`,
  `Do You Know Who I Am?`,
  `A Dog's Life`,
  `Doin' the Best I Can`,
  `Dominic`,
  `Doncha' Think It's Time`,
  `Don't`,
  `Don't Ask Me Why`,
  `Don't Be Cruel`,
  `Don't Cry Daddy`,
  `Don't Forbid Me`,
  `Don't Leave Me Now`,
  `"Don't Think Twice, It's All Right"`,
  `Double Trouble`,
  `Down by the Riverside`,
  `Down in the Alley`,
  `Drums of the Islands`,
  `Early Morning Rain`,
  `Earth Angel`,
  `Earth Boy`,
  `"Easy Come, Easy Go"`,
  `Echoes of Love`,
  `Edge of Reality`,
  `El Toro`,
  `End of the Road`,
  `An Evening Prayer`,
  `Everybody Come Aboard`,
  `The Eyes of Texas`,
  `Faded Love`,
  `The Fair's Moving On`,
  `Fairytale`,
  `Fame and Fortune`,
  `Farther Along`,
  `Fever`,
  `Find Out What's Happening`,
  `"Finders Keepers, Losers Weepers"`,
  `First in Line`,
  `The First Noel`,
  `The First Time Ever I Saw Your Face`,
  `Five Sleepy Heads`,
  `Flaming Star[4]`,
  `"Flip, Flop and Fly[5]"`,
  `Follow That Dream`,
  `Fool`,
  `"Fool, Fool, Fool"`,
  `The Fool[6]`,
  `Fools Fall in Love`,
  `Fools Rush In (Where Angels Fear to Tread)`,
  `For Ol' Times Sake`,
  `For the Good Times`,
  `For the Heart`,
  `For the Millionth and the Last Time`,
  `Forget Me Never`,
  `Fort Lauderdale Chamber of Commerce`,
  `Fountain of Love`,
  `Frankfort Special`,
  `Frankie and Johnny`,
  `Froggy Went A-Courting`,
  `From a Jack to a King`,
  `Fun in Acapulco`,
  `Funny How Time Slips Away`,
  `G.I. Blues`,
  `Gentle on My Mind`,
  `Gently`,
  `Ghost Riders in the Sky`,
  `Girl Happy`,
  `The Girl I Never Loved`,
  `Girl Next Door Went A-Walking`,
  `Girl of Mine`,
  `The Girl of My Best Friend`,
  `Girls! Girls! Girls!`,
  `Give Me the Right`,
  `Go East-Young Man`,
  `Goin' Home`,
  `Golden Coins`,
  `Gonna Get Back Home Somehow`,
  `Good Luck Charm`,
  `Good Rocking Tonight`,
  `Good Time Charlie's Got the Blues`,
  `Got a Lot o' Livin' to Do`,
  `Got My Mojo Working`,
  `"Green, Green Grass of Home"`,
  `Guadalajara`,
  `Guitar Man`,
  `Hands Off`,
  `Happy Ending`,
  `"Happy, Happy Birthday Baby"`,
  `Harbor Lights`,
  `Hard Headed Woman`,
  `Hard Knocks`,
  `Hard Luck`,
  `Harem Holiday`,
  `Have a Happy`,
  `Have I Told You Lately That I Love You?`,
  `Hawaiian Sunset`,
  `Hawaiian Wedding Song`,
  `He is My Everything`,
  `He Knows Just What I Need`,
  `He`,
  `He Touched Me`,
  `Heart of Rome`,
  `Heartbreak Hotel`,
  `Hearts of Stone`,
  `He'll Have to Go`,
  `Help Me`,
  `Help Me Make It Through the Night`,
  `Here Comes Santa Claus`,
  `"He's Your Uncle, Not Your Dad"`,
  `Hey Jude`,
  `Hey Little Girl`,
  `"Hey, Hey, Hey"`,
  `Hide Thou Me`,
  `Hi-Heel Sneakers`,
  `His Hand in Mine`,
  `Holly Leaves and Christmas Trees`,
  `Home Is Where the Heart Is`,
  `Hot Dog`,
  `Hound Dog`,
  `House of Sand`,
  `A House That Has Everything`,
  `How Can You Lose What You Never Had`,
  `How Do You Think I Feel`,
  `How Great Thou Art`,
  `How the Web Was Woven`,
  `How Would You Like to Be`,
  `How's the World Treating You?`,
  `A Hundred Years from Now`,
  `Hurt`,
  `"Husky, Dusky Day"`,
  `I Asked the Lord (He's Only a Prayer Away)`,
  `I Beg of You`,
  `I Believe`,
  `I Believe in the Man in the Sky`,
  `I Can Help`,
  `I Can't Help It (If I'm Still in Love with You)`,
  `I Can't Stop Loving You`,
  `I Didn't Make It On Playing Guitar (Informal Jam session)`,
  `I Don't Care if the Sun Don't Shine`,
  `I Don't Wanna Be Tied`,
  `I Don't Want To`,
  `I Feel So Bad`,
  `I Feel That I've Known You Forever`,
  `I Forgot to Remember to Forget`,
  `I Got a Feelin' in My Body`,
  `I Got a Woman`,
  `I Got Lucky`,
  `I Got Stung`,
  `I Gotta Know`,
  `I Hear a Sweet Voice Calling`,
  `I Just Can't Help Believin'`,
  `I Just Can't Make It by Myself`,
  `I Love Only One Girl`,
  `I Love You Because`,
  `I Met Her Today`,
  `I Miss You`,
  `I Need Somebody to Lean On`,
  `I Need You So`,
  `I Need Your Love Tonight`,
  `I Need Your Loving (Every Day)`,
  `I Really Don't Want to Know`,
  `I Shall Be Released`,
  `I Shall Not Be Moved`,
  `"I Slipped, I Stumbled, I Fell"`,
  `I Think I'm Gonna Like It Here`,
  `I Understand (Just How You Feel)`,
  `I Walk the Line`,
  `I Want to Be Free`,
  `I Want You with Me`,
  `"I Want You, I Need You, I Love You"`,
  `I Was Born About Ten Thousand Years Ago`,
  `I Was the One`,
  `I Washed My Hands In Muddy Water`,
  `I Will Be Home Again`,
  `I Will Be True`,
  `"I Wonder, I Wonder, I Wonder"`,
  `"I, John"`,
  `If Every Day Was Like Christmas`,
  `If I Can Dream`,
  `If I Get Home on Christmas Day`,
  `If I Loved You`,
  `If I Were You`,
  `If I'm a Fool (For Loving You)`,
  `If That Isn't Love`,
  `If the Lord Wasn't Walking by My Side`,
  `If We Never Meet Again`,
  `If You Don't Come Back`,
  `If You Love Me (Let Me Know)`,
  `If You Talk in Your Sleep`,
  `If You Think I Don't Need You`,
  `I'll Be Back`,
  `I'll Be Home for Christmas`,
  `I'll Be Home on Christmas Day`,
  `I'll Be There`,
  `I'll Hold You in My Heart (Till I Can Hold You in My Arms)`,
  `I'll Never Fall in Love Again`,
  `I'll Never Know`,
  `I'll Never Let You Go (Little Darlin')`,
  `I'll Never Stand In Your Way`,
  `I'll Remember You*`,
  `I'll Take Love`,
  `"I'll Take You Home Again, Kathleen"`,
  `I'm a Roustabout`,
  `I'm Beginning to Forget You`,
  `I'm Comin' Home`,
  `I'm Counting on You`,
  `I'm Falling in Love Tonight`,
  `I'm Gonna Bid My Blues Goodbye`,
  `I'm Gonna Sit Right Down and Cry (Over You)`,
  `I'm Gonna Walk Dem Golden Stairs`,
  `I'm Leavin'`,
  `"I'm Left, You're Right, She's Gone"`,
  `I'm Movin' On`,
  `I'm Not the Marrying Kind`,
  `I'm So Lonesome I Could Cry`,
  `I'm With a Crowd (But So Alone)`,
  `I'm Yours`,
  `The Impossible Dream`,
  `In My Father's House`,
  `In My Way`,
  `In the Garden`,
  `In the Ghetto`,
  `In Your Arms`,
  `Indescribably Blue`,
  `Inherit the Wind`,
  `Is It So Strange`,
  `Island Of Love`,
  `It Ain't No Big Thing (But It's Growing)`,
  `It Feels So Right`,
  `It Hurts Me`,
  `It Is No Secret (What God Can Do)`,
  `It Keeps Right On A-Hurtin'`,
  `It Won't Be Long`,
  `It Won't Seem Like Christmas (Without You)`,
  `It Wouldn't Be the Same without You`,
  `Ito Eats`,
  `It's a Matter of Time`,
  `It's a Sin`,
  `It's a Sin to Tell a Lie`,
  `It's a Wonderful World`,
  `(It's a) Long Lonely Highway`,
  `It's Been So Long Darling`,
  `It's Carnival Time`,
  `It's Diff'rent Now`,
  `It's Easy for You`,
  `It's Impossible`,
  `It’s Midnight`,
  `It’s No Fun Being Lonely`,
  `It's Now or Never`,
  `It's Only Love`,
  `It's Over`,
  `It's Still Here`,
  `It's Your Baby You Rock It`,
  `I've Got a Thing About You Baby`,
  `I've Got Confidence`,
  `I've Got To Find My Baby`,
  `I've Lost You`,
  `Jailhouse Rock`,
  `Johnny B. Goode`,
  `Joshua Fit the Battle`,
  `Judy`,
  `Just a Closer Walk with Thee`,
  `Just a Little Bit`,
  `Just a Little Talk with Jesus`,
  `Just Because`,
  `Just Call Me Lonesome`,
  `Just for Old Time Sake`,
  `Just Pretend`,
  `Just Tell Her Jim Said Hello`,
  `Keep Your Hands Off Of It[10]`,
  `Keeper Of The Key`,
  `Kentucky Rain`,
  `King Creole`,
  `King of the Whole Wide World`,
  `Kismet`,
  `Kiss Me Quick`,
  `Kissin' Cousins`,
  `Kissin' Cousins (Number 2)`,
  `Known Only to Him`,
  `Ku-U-I-Po`,
  `The Lady Loves Me (with Ann-Margret)`,
  `Lady Madonna`,
  `The Last Farewell`,
  `Lawdy Miss Clawdy`,
  `"Lead Me, Guide Me"`,
  `Let It Be Me`,
  `Let Me`,
  `Let Me Be the One`,
  `Let Me Be There`,
  `(Let Me Be Your) Teddy Bear`,
  `Let Yourself Go`,
  `Let's Be Friends`,
  `Let's Forget About the Stars`,
  `Let Us Pray`,
  `Life`,
  `Like a Baby`,
  `Listen to the Bells`,
  `A Little Bit of Green`,
  `Little Cabin on the Hill`,
  `Little Darlin'`,
  `Little Egypt (Ying-Yang)`,
  `A Little Less Conversation`,
  `Little Mama`,
  `Little Sister`,
  `Lonely Man`,
  `Lonesome Cowboy`,
  `Long Black Limousine`,
  `Long Legged Girl (With the Short Dress On)`,
  `Long Tall Sally`,
  `"Look Out, Broadway"`,
  `The Lord's Prayer`,
  `Love Coming Down`,
  `Love Letters`,
  `The Love Machine`,
  `Love Me`,
  `Love Me Tender`,
  `Love Me Tonight`,
  `"Love Me, Love the Life I Lead"`,
  `Love Song of the Year`,
  `Lover Doll`,
  `Loving Arms`,
  `Loving You`,
  `Make Me Know It`,
  `Make the World Go Away`,
  `Mama`,
  `Mama Liked the Roses`,
  `Mansion Over the Hilltop`,
  `Marguerita`,
  `(Marie's the Name) His Latest Flame`,
  `Mary in the Morning`,
  `Mary Lou Brown`,
  `Maybellene`,
  `Mean Woman Blues`,
  `The Meanest Girl in Town`,
  `Memories`,
  `Memphis Tennessee`,
  `Men with Broken Hearts`,
  `Merry Christmas Baby`,
  `A Mess of Blues`,
  `Mexico`,
  `Mickey Mouse Club March`,
  `Milkcow Blues Boogie`,
  `Milky White Way`,
  `Mine`,
  `Miracle of the Rosary`,
  `Mirage`,
  `Mona Lisa`,
  `Money Honey`,
  `Moody Blue`,
  `Moonlight Sonata`,
  `Moonlight Swim`,
  `Mr. Songman`,
  `Must Jesus Bear the Cross Alone`,
  `My Babe`,
  `My Baby Left Me`,
  `My Boy`,
  `My Desert Serenade`,
  `My Happiness`,
  `My Heart Cries for You`,
  `My Little Friend`,
  `My Way`,
  `My Wish Came True`,
  `Mystery Train`,
  `"Nearer, My God, to Thee"`,
  `Never Again`,
  `Never Been to Spain`,
  `Never Ending`,
  `Never Say Yes`,
  `New Orleans`,
  `The Next Step Is Love`,
  `Night Life`,
  `Night Rider`,
  `No More`,
  `No Room to Rhumba in a Sports Car`,
  `Nothingville`,
  `(Now and Then There's) A Fool Such as I`,
  `"O Come, All Ye Faithful"`,
  `O Little Town of Bethlehem`,
  `Oh Happy Day (1)`,
  `Oh Happy Day (2)`,
  `"Oh, How I Love Jesus"`,
  `Old MacDonald`,
  `Old Shep`,
  `On a Snowy Christmas Night`,
  `On the Jericho Road`,
  `Once Is Enough`,
  `"One Boy, Two Little Girls"`,
  `One Broken Heart for Sale`,
  `One Night[13]`,
  `One-sided Love Affair`,
  `One Track Heart`,
  `Only Believe`,
  `Only the Strong Survive`,
  `"Out Of Sight, Out Of Mind"`,
  `Padre`,
  `"Paradise, Hawaiian Style"`,
  `Paralyzed`,
  `Party`,
  `Patch It Up`,
  `(There'll Be) Peace in the Valley (For Me)`,
  `Peter Gunn Theme[15]`,
  `"Petunia, the Gardener's Daughter"`,
  `Pieces of My Life`,
  `Plantation Rock`,
  `Playing for Keeps`,
  `Please Don't Drag That String Around`,
  `Please Don't Stop Loving Me`,
  `Pledging My Love`,
  `Pocketful of Rainbows`,
  `Poison Ivy League`,
  `Polk Salad Annie`,
  `Poor Boy`,
  `Poor Man's Gold`,
  `Portrait of My Love`,
  `Power of My Love`,
  `Promised Land`,
  `Proud Mary`,
  `Puppet On A String`,
  `Put the Blame On Me`,
  `Put Your Hand in the Hand`,
  `Queenie Wahine's Papaya`,
  `Rags to Riches`,
  `Raised on Rock`,
  `Reach Out to Jesus`,
  `Ready Teddy`,
  `Reconsider Baby`,
  `Relax`,
  `Release Me`,
  `Return to Sender`,
  `Riding the Rainbow`,
  `Rip It Up`,
  `Rock-A-Hula Baby`,
  `Roustabout`,
  `Rubberneckin'`,
  `Run On`,
  `Runaway`,
  `San Antonio Rose`,
  `Sand Castles`,
  `Santa Claus Is Back In Town`,
  `Santa Lucia`,
  `Santa Bring My Baby Back (to Me)`,
  `Saved`,
  `Scratch My Back`,
  `See See Rider`,
  `Seeing Is Believing`,
  `Send Me Some Lovin'`,
  `Sentimental Me`,
  `Separate Ways`,
  `Shake a Hand`,
  `"Shake, Rattle and Roll"`,
  `Shake That Tambourine`,
  `She Thinks I Still Care`,
  `She Wears My Ring`,
  `She's a Machine`,
  `She's Not You`,
  `Shoppin' Around`,
  `Shout It Out`,
  `"Show Me Thy Ways, O Lord"`,
  `Signs of the Zodiac`,
  `Silent Night`,
  `Silver Bells`,
  `Sing You Children`,
  `Singing Tree`,
  `Slicin' Sand`,
  `Slowly But Surely`,
  `Smokey Mountain Boy`,
  `Smorgasbord`,
  `Snowbird`,
  `"So Close, Yet So Far (From Paradise)"`,
  `So Glad You're Mine`,
  `So High`,
  `Softly and Tenderly`,
  `Softly As I Leave You`,
  `Soldier Boy`,
  `Solitaire`,
  `Somebody Bigger Than You and I`,
  `Something Blue`,
  `Something`,
  `Song of the Shrimp`,
  `Sound Advice`,
  `The Sound of Your Cry`,
  `Spanish Eyes`,
  `Speedway`,
  `Spinout`,
  `Spring Fever`,
  `Stand by Me`,
  `Startin' Tonight`,
  `Starting Today`,
  `Stay Away`,
  `"Stay Away, Joe"`,
  `"Steadfast, Loyal and True"`,
  `Steamroller Blues`,
  `Steppin' Out of Line`,
  `"Stop, Look and Listen"`,
  `Stop Where You Are`,
  `Stranger In My Own Home Town`,
  `Stranger in the Crowd`,
  `Stuck on You`,
  `Such a Night`,
  `(Such an) Easy Question`,
  `"Summer Kisses, Winter Tears"`,
  `Summertime Has Passed and Gone`,
  `Suppose`,
  `Surrender`,
  `Susan When She Tried`,
  `Suspicion`,
  `Suspicious Minds`,
  `Sweet Angeline`,
  `Sweet Caroline`,
  `Sweet Leilani`,
  `"Sweetheart, You Done Me Wrong"`,
  `Swing Down Sweet Chariot`,
  `Sylvia`,
  `Take Good Care of Her`,
  `Take Me to the Fair`,
  `"Take My Hand, Precious Lord"`,
  `Talk About the Good Times`,
  `Tell Me Why`,
  `Tender Feeling`,
  `Tennessee Waltz`,
  `Thanks to the Rolling Sea`,
  `That's All Right`,
  `That's My Desire`,
  `That's Someone You Never Forget`,
  `(That's What You Get) For Lovin' Me`,
  `That's When Your Heartaches Begin`,
  `There Ain't Nothing Like a Song (with Nancy Sinatra)`,
  `There Goes My Everything`,
  `There Is No God But God`,
  `There Is So Much World to See`,
  `There's a Brand New Day on the Horizon`,
  `There's a Honky Tonk Angel (Who'll Take Me Back In)`,
  `There's Always Me`,
  `There's Gold in the Mountains`,
  `There's No Place Like Home`,
  `There's No Tomorrow`,
  `They Remind Me Too Much of You`,
  `A Thing Called Love`,
  `Thinking About You`,
  `This Is Living`,
  `This Is My Heaven`,
  `This Is Our Dance`,
  `This Is the Story`,
  `This Time`,
  `Three Corn Patches`,
  `Thrill of Your Love`,
  `Tiger Man`,
  `The Titles Will Tell`,
  `"Today, Tomorrow and Forever"`,
  `Tomorrow is a Long Time`,
  `Tomorrow Never Comes`,
  `Tomorrow Night`,
  `Tonight Is So Right for Love`,
  `Tonight's All Right for Love`,
  `Too Much`,
  `Too Much Monkey Business`,
  `Treat Me Nice`,
  `T-R-O-U-B-L-E`,
  `Trouble`,
  `True Love`,
  `True Love Travels on a Gravel Road`,
  `Tryin' to Get to You`,
  `Tumbling Tumbleweeds`,
  `"Turn Around, Look at Me"`,
  `Turn Your Eyes Upon Jesus`,
  `Tutti Frutti`,
  `Tweedle Dee`,
  `The Twelfth of Never`,
  `Twenty Days and Twenty Nights`,
  `U.S. Male`,
  `Unchained Melody`,
  `Until It's Time for You to Go`,
  `Until Then`,
  `Up Above My Head`,
  `"Vino, Dinero y Amor"`,
  `Violet`,
  `Viva Las Vegas`,
  `Walk a Mile in My Shoes`,
  `Walk That Lonesome Road`,
  `The Walls Have Ears`,
  `Wasted Years`,
  `Way Down`,
  `We Call On Him`,
  `We Can Make the Morning`,
  `Wear My Ring Around Your Neck`,
  `Wearin' That Loved-On Look`,
  `Welcome to My World`,
  `We'll Be Together`,
  `We're Comin' In Loaded`,
  `We're Gonna Move`,
  `Western Union`,
  `What a Wonderful Life`,
  `What Every Woman Lives For`,
  `What Now My Love`,
  `"What Now, What Next, Where To"`,
  `What'd I Say`,
  `What's She Really Like`,
  `Wheels on My Heels`,
  `When God Dips His Love In My Heart`,
  `When I'm Over You`,
  `"When It Rains, It Really Pours"`,
  `When My Blue Moon Turns to Gold Again`,
  `When the Saints Go Marching In[17]`,
  `When the Snow Is on the Roses`,
  `When the Swallows Come Back to Capistrano`,
  `Where Could I Go but to the Lord`,
  `Where Did They Go Lord`,
  `Where Do I Go from Here?`,
  `Where Do You Come From`,
  `Where No One Stands Alone`,
  `The Whiffenpoof Song`,
  `A Whistling Tune`,
  `White Christmas`,
  `Who Am I?`,
  `Who Are You (Who Am I?)`,
  `Who Needs Money`,
  `Whole Lotta Shakin' Goin' On`,
  `Who's Sorry Now`,
  `"Why Me, Lord?"`,
  `Wild in the Country`,
  `Winter Wonderland`,
  `Wisdom of the Ages`,
  `Witchcraft (1)`,
  `Witchcraft (2)`,
  `Without a Song`,
  `Without Him`,
  `Without Love (There Is Nothing)`,
  `Wolf Call`,
  `Woman Without Love`,
  `The Wonder of You`,
  `Wonderful World`,
  `The Wonderful World of Christmas`,
  `Wooden Heart`,
  `Words`,
  `A World of Our Own`,
  `Working on the Building`,
  `Write to Me from Naples`,
  `The Yellow Rose of Texas`,
  `Yoga is as Yoga Does`,
  `You Asked Me To`,
  `You Belong to My Heart`,
  `You Better Run`,
  `You Can Have Her`,
  `You Can't Say No in Acapulco`,
  `You Don't Have to Say You Love Me`,
  `You Don't Know Me`,
  `You Gave Me a Mountain`,
  `You Gotta Stop`,
  `You'll Be Gone`,
  `You'll Never Walk Alone`,
  `You'll Think of Me`,
  `Young and Beautiful`,
  `Young Dreams`,
  `Young Love`,
  `Your Cheatin' Heart`,
  `Your Love's Been a Long Time Coming`,
  `Your Mama Don't Dance`,
  `"Your Time Hasn't Come Yet, Baby"`,
  `You're a Heartbreaker`,
  `(You're So Square) Baby I Don't Care`,
  `You're the Boss (with Ann-Margret)`,
  `You're the Reason I'm Living`,
  `(You're the) Devil in Disguise`,
  `You've Lost That Lovin' Feelin'`
];

export default Service.extend({
  init() {
    this.set('data', songs);
  },
  random() {
    return this.get('data')[Math.floor(Math.random() * this.get('data').length)];
  }
});
