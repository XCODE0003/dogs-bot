export interface DepopJson {
    props: Props
    page: string
    query: Query2
    buildId: string
    runtimeConfig: RuntimeConfig
    isFallback: boolean
    dynamicIds: number[]
    customServer: boolean
    gip: boolean
    appGip: boolean
    locale: string
    locales: string[]
    defaultLocale: string
    scriptLoader: any[]
}

export interface Props {
    initialI18nStore: InitialI18nStore
    initialLanguage: string
    i18nServerInstance: any
    pageProps: PageProps
    inAppView: boolean
    referer: string
    isWebCrawler: boolean
    reqCountryCode: string
    reqCity: string
    initialReduxState: InitialReduxState
}

export interface InitialI18nStore {
    en: En
}

export interface En {
    common: Common
    product: Product
    bag: Bag
}

export interface Common {
    "BoostedListings.Boosted": string
    "Condition.Title": string
    "ConversationListItem.NewMessage": string
    "QuickMessage.SeeMessages": string
    "QuickMessage.MessageBuyer": string
    "QuickMessage.MessageSeller": string
    "Nav.Blog": string
    "Nav.Events": string
    "Nav.Spaces": string
    "Nav.Support": string
    "Nav.Download": string
    "Nav.About": string
    "Nav.SellOnDepop": string
    "Nav.Jobs": string
    "Nav.Search": string
    "Nav.Menu": string
    "Nav.Login": string
    "Nav.Logout": string
    "Nav.SignUp": string
    "Nav.News": string
    "Nav.Profile": string
    "Nav.BuyersReceipts": string
    "Nav.Press": string
    "Nav.Terms": string
    "Nav.Privacy": string
    "Nav.Safety": string
    "Nav.Sell": string
    "Nav.ProductCategoriesMenuTitle": string
    "Nav.SecondaryNavTitle": string
    "Nav.SelectLanguage": string
    "Nav.SelectLocation": string
    "Nav.Messages": string
    "Nav.Cookies": string
    "Nav.Sitemaps": string
    "Nav.ShopThemes": string
    "Nav.PopularBrands": string
    "Nav.Likes": string
    "Nav.LikesPreview.Header": string
    "Nav.LikesPreview.ViewAllLikes": string
    "Nav.LikesPreview.BrowseDepop": string
    "Nav.LikesPreview.NoLikes.Heading": string
    "Nav.LikesPreview.NoLikes.Text": string
    "Nav.LikesPreview.ErrorMessage": string
    "Nav.LikesPreview.AriaLabel": string
    "Nav.Home": string
    "Nav.Drc": string
    "Nav.Settings": string
    "Nav.Bag": string
    "Nav.Bag_plural": string
    SelectChevronTitle: string
    SelectNoGroupLabel: string
    "CookieBanner.message": string
    "CookieBanner.linkText": string
    "404.Message": string
    "404.HttpMessage": string
    "500.Message": string
    "500.HttpMessage": string
    PleaseTryAgain: string
    "Search.NotFound": string
    "Search.Placeholder": string
    "BuyerProtection.Description": string
    "DownloadModal.DefaultTitle": string
    "DownloadModal.DefaultDescription": string
    "DownloadModal.Login": string
    "AppStore.Link": string
    "PlayStore.Link": string
    SoldSingular: string
    "Application.DefaultTitle": string
    "Application.DefaultDescription": string
    "PhoneBox.PhoneNumber": string
    "PhoneBox.Prefix": string
    "Error.RequiredField": string
    Hashtags: string
    "SendDownloadSms.InvalidNumber": string
    "SendDownloadSms.LimitReached": string
    "SendDownloadSms.SuccessMessage": string
    "SendDownloadSms.Resend": string
    "SendDownloadSms.Download": string
    "DownloadModal.FollowsTitle": string
    MetaTitleSellOnDepop: string
    MetaDescriptionSellOnDepop: string
    Cancel: string
    Verified: string
    "SkipToContent.main": string
    "SkipToContent.footer": string
    "Colour.black": string
    "Colour.grey": string
    "Colour.white": string
    "Colour.cream": string
    "Colour.tan": string
    "Colour.yellow": string
    "Colour.red": string
    "Colour.burgundy": string
    "Colour.orange": string
    "Colour.pink": string
    "Colour.purple": string
    "Colour.brown": string
    "Colour.khaki": string
    "Colour.green": string
    "Colour.blue": string
    "Colour.navy": string
    "Colour.multi": string
    "Colour.silver": string
    "Colour.gold": string
    "Colour.other": string
    "Style.streetwear": string
    "Style.sportswear": string
    "Style.loungewear": string
    "Style.goth": string
    "Style.retro": string
    "Style.trap": string
    "Style.boho": string
    "Style.western": string
    "Style.indie": string
    "Style.skater": string
    "Style.cute": string
    "Style.chic": string
    "Style.rave": string
    "Style.pastel": string
    "Style.bright": string
    "Style.costume": string
    "Style.cosplay": string
    "Style.grunge": string
    "Style.party": string
    "Style.funky": string
    "Age.modern": string
    "Age.y2k": string
    "Age.90s": string
    "Age.80s": string
    "Age.70s": string
    "Age.60s": string
    "Age.50s": string
    "Age.antique": string
    "Source.vintage": string
    "Source.preloved": string
    "Source.reworked": string
    "Source.custom": string
    "Source.handmade": string
    "Source.deadstock": string
    "Source.designer": string
    "SearchBar.Placeholder": string
    "SearchBar.Placeholder.Short": string
    Brand: string
    Brands: string
    TrustItemsSold: string
    TrustActiveToday: string
    TrustActiveThisWeek: string
    TrustActiveWeeksAgo: string
    "Style.Title": string
    "Colour.Title": string
    Filters: string
    Category: string
    Subcategory: string
    Size: string
    Price: string
    FullPrice: string
    DiscountedPrice: string
    TaxIncluded: string
    Back: string
    Continue: string
    ShowMore: string
    ShowLess: string
    NoProducts: string
    NoResults: string
    BackToTop: string
    "Gdpr.CookieBannerTitle": string
    "Gdpr.CookieBannerInformation": string
    "Gdpr.CookieBannerAcceptAllButton": string
    "Gdpr.CookieBannerManageCookiesButton": string
    "Gdpr.CookieModalTitle": string
    "Gdpr.CookieModalIntro": string
    "Gdpr.CookieModalCancelButton": string
    "Gdpr.CookieModalAcceptButton": string
    "Gdpr.CookieModalNecessaryTitle": string
    "Gdpr.CookieModalNecessaryContent": string
    "Gdpr.CookieModalSocialTitle": string
    "Gdpr.CookieModalSocialContent": string
    "Gdpr.CookieModalAnalyticsTitle": string
    "Gdpr.CookieModalAnalyticsContent": string
    "Gdpr.CookieModalFunctionalTitle": string
    "Gdpr.CookieModalFunctionalContent": string
    "Gdpr.CookieModalInputOn": string
    "Gdpr.CookieModalInputOff": string
    Shipping: string
    FreeShipping: string
    "CurrencyDropdown.SVGTitle": string
    DownloadSales: string
    "DownloadSalesModal.Title": string
    "DownloadSalesModal.DownloadButton": string
    "DownloadSalesModal.FileName": string
    "DownloadSalesModal.Link": string
    "DownloadSalesModal.DateLimitDescription": string
    "ShareButton.Copy": string
    "ShareButton.Copied": string
    Share: string
    "FormStepper.Progress": string
    GetTheApp: string
    "GetTheApp.Banner.Title": string
    "GetTheApp.Banner.Text": string
    "GetTheApp.QRCode.Alt": string
    "SignupModal.Title": string
    "SignupModal.Text": string
    "SignupModal.Login": string
    ShopNow: string
    Clear: string
    "Error.ShippingAddress.PostalCode": string
    "Error.ShippingAddress.Email": string
    "Error.ShippingAddress.PhoneNumber": string
    "Error.ShippingAddress.RequiredFields": string
    "Error.ShippingAddress.RequestFailed": string
    "ShippingAddress.Label.Name": string
    "ShippingAddress.Label.Address": string
    "ShippingAddress.Label.Address2": string
    "ShippingAddress.Label.City": string
    "ShippingAddress.Label.State": string
    "ShippingAddress.Label.PostalCode": string
    "ShippingAddress.Label.Country": string
    "ShippingAddress.Label.Email": string
    "ShippingAddress.Label.PhoneNumber": string
    "PaymentCard.Label.CardNumber": string
    "PaymentCard.Label.CardExpiry": string
    "PaymentCard.Label.CardCvc": string
    "PaymentCard.Label.CardPostalCode": string
    "Error.PaymentCard.CardNumber": string
    "Error.PaymentCard.CardExpiry": string
    "Error.PaymentCard.CardCvc": string
    "Error.PaymentCard.CardPostalCode": string
    MultipleSizes: string
    SeeMore: string
    "Sorting.Relevance": string
    "Sorting.PriceAscending": string
    "Sorting.PriceDescending": string
    "Sorting.MostPopular": string
    "Sorting.NewlyListed": string
    "Sorting.SortBy": string
    "Sorting.Sort": string
    ClearAll: string
    ViewAll: string
    ShowAll: string
    BrowseAllBrands: string
    More: string
    Menswear: string
    Tops: string
    Bottoms: string
    Underwear: string
    Outerwear: string
    Shoes: string
    Accessories: string
    Womenswear: string
    Dresses: string
    Lingerie: string
    Jewellery: string
    Art: string
    Kids: string
    Beauty: string
    SportsEquipment: string
    Transportation: string
    Other: string
    BooksMagazines: string
    Film: string
    Music: string
    Jeans: string
    Sweatpants: string
    CasualPants: string
    DressPants: string
    Tracksuits: string
    Dungarees: string
    Shorts: string
    TShirts: string
    Jumpers: string
    Cardigans: string
    Sweatshirts: string
    Hoodies: string
    TankTops: string
    PoloShirts: string
    DressShirts: string
    CasualShirts: string
    AnkleBoots: string
    Sneakers: string
    FlipFlopsSlides: string
    CasualShoes: string
    DressShoes: string
    Bags: string
    Belts: string
    Hats: string
    Caps: string
    Gloves: string
    Scarves: string
    Sunglasses: string
    Watches: string
    Socks: string
    LeatherJackets: string
    BomberJackets: string
    Parkas: string
    PeaCoats: string
    DenimJackets: string
    TrenchCoats: string
    Windbreakers: string
    Blazers: string
    CapesPonchos: string
    PufferJackets: string
    TrackJackets: string
    Gilets: string
    Suits: string
    Boxers: string
    Briefs: string
    Swimwear: string
    Blouses: string
    Bralets: string
    CamiTops: string
    CropTops: string
    BandeauTops: string
    Vests: string
    Bodysuits: string
    Skirts: string
    BootcutJeans: string
    SkinnyJeans: string
    Overalls: string
    BoyfriendJeans: string
    Jeggings: string
    Leggings: string
    FlareJeans: string
    CasualTrousers: string
    WideLegJeans: string
    Playsuits: string
    Culottes: string
    RippedJeans: string
    HighWaistedJeans: string
    CasualDresses: string
    EveningDresses: string
    GoingOutDresses: string
    SummerDresses: string
    MaxiDresses: string
    Jumpsuits: string
    MidiDresses: string
    PromDresses: string
    BabydollDresses: string
    Rompers: string
    BodyconDresses: string
    Kimonos: string
    FauxFurCoats: string
    BagsPurses: string
    Wallets: string
    HairAccessories: string
    SocksTights: string
    Bras: string
    Nightgowns: string
    Camisoles: string
    Pyjamas: string
    Robes: string
    Sandals: string
    Loafers: string
    Boots: string
    Heels: string
    KneeHighBoots: string
    Platforms: string
    Slides: string
    Trainers: string
    Wedges: string
    Flats: string
    Prints: string
    Photography: string
    Paintings: string
    Collectibles: string
    DrawingsIllustrations: string
    Sculptures: string
    MixedMedia: string
    Necklaces: string
    Rings: string
    Earrings: string
    Bracelets: string
    BodyJewelry: string
    Pins: string
    Makeup: string
    Skincare: string
    Fragrance: string
    Hair: string
    BathBody: string
    ToolsBrushes: string
    FaceMasks: string
    Fleeces: string
    SnowSuits: string
    Jerseys: string
    Bustiers: string
    Shirts: string
    MiniSkirts: string
    MaxiSkirts: string
    Brogues: string
    ChelseaBoots: string
    MomJeans: string
    PencilSkirts: string
    PleatedSkirts: string
    ShirtDresses: string
    WrapDresses: string
    OverTheKneeBoots: string
    Cameras: string
    Joggers: string
    Mens: string
    Womens: string
    All: string
    Home: string
    PopularCategories: string
    WomenSSale: string
    MenSSale: string
    Sportswear: string
    Festival: string
    Holiday: string
    HotOnDepop: string
    "LogInModal.LoggedOutTitle": string
    "LogInModal.LoggedOutBody": string
    "LogInModal.LogIn": string
    "LogInModal.MobileDownload": string
    "LogInModal.FollowBody": string
    "LogInModal.Or": string
    "LogInModal.QRTitle": string
    "LogInModal.QRBody": string
    Steps: string
    LikesAndSaves: string
    MyLikes: string
    MySaves: string
    Day: string
    Month: string
    Year: string
    DateOfBirth: string
    "DateOfBirth.DayError": string
    "DateOfBirth.MonthError": string
    "DateOfBirth.YearError": string
    "DateOfBirth.DateError": string
    "DateOfBirth.AgeError": string
    Separator: string
    ContinueWithApple: string
    "ShopCollection.Default": string
    "MetaDescr.Default": string
    Optional: string
    LoadMore: string
    "MakeOfferModal.Title": string
    "MakeOfferModal.Body": string
    "MakeOfferModal.QRCode.Title": string
    "MakeOfferModal.QRCode.Body": string
    "MakeOffer.QRCode.Alt": string
    "MakeOfferModal.CtaText": string
    "MakeOfferSticker.Alt": string
    NewlyListedNudge: string
}

export interface Product {
    Buy: string
    ChooseSize: string
    EditItem: string
    "EditItem.Short": string
    CopyItem: string
    "CopyItem.Short": string
    DeleteProduct: string
    DeleteProductMessage: string
    DeleteProductError: string
    EstimateShippingTime: string
    "EstimatedShippingTime.Singular": string
    "EstimatedShippingTime.Plural": string
    Followers: string
    Follower: string
    ListedMinutesAgo: string
    ListedMinutesAgo_plural: string
    ListedHoursAgo: string
    ListedHoursAgo_plural: string
    ListedDaysAgo: string
    ListedDaysAgo_plural: string
    ListedMonthsAgo: string
    ListedMonthsAgo_plural: string
    ListedYearsAgo: string
    ListedYearsAgo_plural: string
    ListedAndUpdatedOnSameDay: string
    ListedAndUpdatedOnDifferentDay: string
    MessageSeller: string
    PercentageOff: string
    BuyerProtection: string
    SimilarItems: string
    RecentlyViewed: string
    MoreItemsTitle: string
    Like: string
    Like_plural: string
    MultipleSizes: string
    SimilarItemsSashHeading: string
    NoRecentlyViewedItems: string
    ReviewsModuleHeading: string
    ReviewsModuleStarAverage: string
    SuggestedSearchesTitle: string
    FirstListingSuccessMessage: string
    GotOneLikeThis: string
    SellASimilarItem: string
    MakeOffer: string
    BagNudgePlural: string
    BagNudgeSingular: string
    BodyFit: string
    "BodyFit.maternity": string
    "BodyFit.petite": string
    "BodyFit.plus-size": string
    "BodyFit.tall": string
    Brand: string
    "Nav.Home": string
    FreeShipping: string
    TaxIncluded: string
    SoldSingular: string
    "AddToBag.Button": string
    "AddToBag.Added": string
    "Error.AddToBag": string
    Size: string
    "Condition.Title": string
    "Style.Title": string
    "Colour.Title": string
    SeeMore: string
    ClearAll: string
    Material: string
}

export interface Bag {
    "Bag.Title": string
    "Error.NotLoggedIn": string
    "Error.AddToBag": string
    "Error.DeleteProduct": string
    "Bag.Summary.Shipping": string
    "Bag.Summary.Items": string
    "Bag.Summary.Total": string
    "Bag.Summary.CheckoutButton": string
    "Bag.Summary.CheckoutButton_plural": string
    "Bag.Summary.FreeShipping": string
    "Bag.SoldOut.Title": string
    "Bag.SoldOut.Button": string
    "Bag.SoldOut.ImageOverlay": string
    "AddToBag.Button": string
    "AddToBag.Added": string
    "Bag.Empty.Title": string
    "Bag.Empty.Subtitle": string
    "Bag.Empty.Cta": string
    "Bag.Error.Title": string
    "Bag.Error.Subtitle": string
    "Bag.Error.TryAgain": string
    "Bag.Error.TryAgain.Button": string
    "Bag.DeleteProduct.Title": string
}

export interface PageProps {
    slug: string
    namespacesRequired: string[]
    _sentryTraceData: string
    _sentryBaggage: string
    userLocale: string
    dehydratedState: DehydratedState
}

export interface DehydratedState {
    mutations: any[]
    queries: Query[]
}

export interface Query {
    state: State
    queryKey: string
    queryHash: string
}

export interface State {
    data: Data
    dataUpdateCount: number
    dataUpdatedAt: number
    error: any
    errorUpdateCount: number
    errorUpdatedAt: number
    fetchFailureCount: number
    fetchMeta: any
    isFetching: boolean
    isInvalidated: boolean
    isPaused: boolean
    status: string
}

export interface Data {
    web_2490_price_point_module: Web2490PricePointModule
    "web-2916_related_searches_higher_in_results": Web2916RelatedSearchesHigherInResults
    web_2640_progress_bar: Web2640ProgressBar
    web_2701_header_search_category: Web2701HeaderSearchCategory
    listing_completion_aa_web_experiment: ListingCompletionAaWebExperiment
    web_2736_in_bags_nudge: Web2736InBagsNudge
    web_2536_shop_branded_categories: Web2536ShopBrandedCategories
    web_2574_shop_page_pagination: Web2574ShopPagePagination
    web_2674_prominent_price_module: Web2674ProminentPriceModule
    web_purchase_intent_test: WebPurchaseIntentTest
    web_2500_shop_filters: Web2500ShopFilters
    web_2698_display_size_on_shop_page: Web2698DisplaySizeOnShopPage
    web_2693_max_width_grid_on_plp: Web2693MaxWidthGridOnPlp
}

export interface Web2490PricePointModule {
    decision: string
    bucketed: boolean
}

export interface Web2916RelatedSearchesHigherInResults {
    decision: string
    bucketed: boolean
}

export interface Web2640ProgressBar {
    decision: string
    bucketed: boolean
}

export interface Web2701HeaderSearchCategory {
    decision: string
    bucketed: boolean
}

export interface ListingCompletionAaWebExperiment {
    decision: string
    bucketed: boolean
}

export interface Web2736InBagsNudge {
    decision: string
    bucketed: boolean
}

export interface Web2536ShopBrandedCategories {
    decision: string
    bucketed: boolean
}

export interface Web2574ShopPagePagination {
    decision: string
    bucketed: boolean
}

export interface Web2674ProminentPriceModule {
    decision: string
    bucketed: boolean
}

export interface WebPurchaseIntentTest {
    decision: string
    bucketed: boolean
}

export interface Web2500ShopFilters {
    decision: string
    bucketed: boolean
}

export interface Web2698DisplaySizeOnShopPage {
    decision: string
    bucketed: boolean
}

export interface Web2693MaxWidthGridOnPlp {
    decision: string
    bucketed: boolean
}

export interface InitialReduxState {
    cookies: Cookies
    user: User
    product: Product2
    location: Location
    explore: Explore
    similar: Similar
    events: Events
    search: Search
    sitemap: Sitemap
    disputes: Disputes
    shop: Shop
    feedback: Feedback
    follows: Follows
    device: Device
    sellerOnboarding: SellerOnboarding
}

export interface Cookies {
    cookieBanner: CookieBanner
}

export interface CookieBanner {
    shouldShow: boolean
    showModalOnly: boolean
}

export interface User {}

export interface Product2 {
    product: Product3
}

export interface Product3 {
    id: number
    address: string
    countryCode: string
    categoryId: number
    price: Price
    dateUpdated: string
    description: string
    pictures: Picture[][]
    status: string
    videos: any[]
    variantSetId: number
    likeCount: number
    seller: Seller
    sizes: Size[]
    condition: Condition
    colour: Colour[]
    age: Age[]
    source: Source[]
    style: Style[]
    group: string
    attributes: Attributes
    productType: string
    gender: string
    isKids: boolean
    slug: string
}

export interface Price {
    currencyName: string
    priceAmount: string
    internationalShippingCost: string
    nationalShippingCost: string
}

export interface Picture {
    id: number
    width: number
    height: number
    url: string
}

export interface Seller {
    verified: boolean
    initials: string
    id: number
    picture: Picture2[]
    username: string
    reviewsRating: number
    reviewsTotal: number
    itemsSold: number
    lastSeen: string
    firstName: string
    lastName: string
}

export interface Picture2 {
    id: number
    width: number
    height: number
    url: string
}

export interface Size {
    id: number
    name: string
    quantity: number
}

export interface Condition {
    id: string
    name: string
}

export interface Colour {
    id: string
    name: string
}

export interface Age {
    id: string
    name: string
}

export interface Source {
    id: string
    name: string
}

export interface Style {
    id: string
    name: string
}

export interface Attributes {}

export interface Location {
    location: string
}

export interface Explore {
    products: any[]
    meta: Meta
    fetchState: string
}

export interface Meta {
    limit: number
    end: boolean
    last_offset_id: string
}

export interface Similar {
    similar: Similar2
    moreItems: MoreItems
}

export interface Similar2 {
    products: any[]
    meta: any
    fetchState: string
}

export interface MoreItems {
    products: any[]
    meta: any
    fetchState: string
}

export interface Events {
    events: any[]
}

export interface Search {
    productsFetchState: string
    productsPageFetchState: string
    filterAggregatesFetchState: string
    categoriesFetchState: string
    sizeGroupsFetchState: string
    productAttributesFetchState: string
    products: any[]
    productIds: ProductIds
    meta: any
    filterAggregates: any
    categories: Categories
    sizeGroups: SizeGroups
    sizes: Sizes
    productAttributes: ProductAttributes
    isSearchTriggeredBySuggestion: boolean
    searchSuggestionType: string
    landingPageTaxonomies: LandingPageTaxonomies
    categoryNavigationTree: CategoryNavigationTree[]
    productFetchCacheMeta: ProductFetchCacheMeta
}

export interface ProductIds {}

export interface Categories {
    categories: Categories2
    subcategories: Subcategories
    categoriesById: CategoriesById
    allSizeGroups: any[]
    sizeGroupsToCats: SizeGroupsToCats
}

export interface Categories2 {
    mens: any[]
    womens: any[]
    other: any[]
}

export interface Subcategories {}

export interface CategoriesById {}

export interface SizeGroupsToCats {}

export interface SizeGroups {}

export interface Sizes {}

export interface ProductAttributes {
    condition: Condition2
    colour: Colour2
}

export interface Condition2 {}

export interface Colour2 {}

export interface LandingPageTaxonomies {
    brandById: BrandById
    brandBySlug: BrandBySlug
    categoryById: CategoryById
    categoryByPath: CategoryByPath
}

export interface BrandById {}

export interface BrandBySlug {}

export interface CategoryById {
    "1": N1
    "2": N2
    "3": N3
    "4": N4
    "5": N5
    "6": N6
    "7": N7
    "8": N8
    "9": N9
    "10": N10
    "11": N11
    "12": N12
    "13": N13
    "14": N14
    "16": N16
    "17": N17
    "18": N18
    "19": N19
    "21": N21
    "22": N22
    "23": N23
    "24": N24
    "25": N25
    "26": N26
    "27": N27
    "28": N28
    "29": N29
    "35": N35
    "36": N36
    "37": N37
    "38": N38
    "39": N39
    "40": N40
    "41": N41
    "42": N42
    "43": N43
    "44": N44
    "45": N45
    "46": N46
    "47": N47
    "48": N48
    "49": N49
    "50": N50
    "51": N51
    "52": N52
    "53": N53
    "54": N54
    "55": N55
    "56": N56
    "57": N57
    "58": N58
    "59": N59
    "60": N60
    "61": N61
    "62": N62
    "63": N63
    "64": N64
    "65": N65
    "66": N66
    "67": N67
    "68": N68
    "69": N69
    "70": N70
    "71": N71
    "72": N72
    "73": N73
    "74": N74
    "75": N75
    "76": N76
    "77": N77
    "78": N78
    "79": N79
    "80": N80
    "81": N81
    "82": N82
    "83": N83
    "84": N84
    "85": N85
    "86": N86
    "87": N87
    "88": N88
    "89": N89
    "90": N90
    "91": N91
    "92": N92
    "93": N93
    "94": N94
    "95": N95
    "96": N96
    "97": N97
    "98": N98
    "99": N99
    "100": N100
    "101": N101
    "102": N102
    "103": N103
    "104": N104
    "105": N105
    "106": N106
    "107": N107
    "108": N108
    "109": N109
    "110": N110
    "111": N111
    "113": N113
    "114": N114
    "115": N115
    "116": N116
    "117": N117
    "118": N118
    "119": N119
    "120": N120
    "121": N121
    "122": N122
    "123": N123
    "124": N124
    "125": N125
    "126": N126
    "127": N127
    "128": N128
    "129": N129
    "130": N130
    "131": N131
    "132": N132
    "133": N133
    "134": N134
    "135": N135
    "136": N136
    "137": N137
    "138": N138
    "139": N139
    "140": N140
    "141": N141
    "142": N142
    "143": N143
    "144": N144
    "145": N145
    "146": N146
    "147": N147
    "148": N148
    "149": N149
    "150": N150
    "151": N151
    "152": N152
    "153": N153
    "154": N154
    "155": N155
    "156": N156
    "157": N157
    "158": N158
    "159": N159
    "160": N160
    "161": N161
    "162": N162
    "163": N163
    "164": N164
    "165": N165
    "166": N166
    "167": N167
    "168": N168
    "169": N169
    "170": N170
    "171": N171
    "172": N172
    "173": N173
    "174": N174
    "175": N175
    "176": N176
    "177": N177
    "178": N178
    "179": N179
    "180": N180
    "181": N181
    "182": N182
    "183": N183
    "184": N184
    "185": N185
    "186": N186
    "187": N187
    "188": N188
    "189": N189
    "190": N190
    "191": N191
    "192": N192
    "193": N193
    "194": N194
    "195": N195
    "196": N196
    "197": N197
    "200": N200
    "201": N201
    "202": N202
    "203": N203
    "204": N204
    "205": N205
    "206": N206
    "207": N207
    "208": N208
    "209": N209
    "210": N210
    "211": N211
    "212": N212
    "213": N213
    "214": N214
    "215": N215
    "216": N216
    "217": N217
    "218": N218
    "219": N219
    "220": N220
    "221": N221
    "222": N222
    "223": N223
    "224": N224
    "225": N225
    "226": N226
    "227": N227
    "228": N228
    "229": N229
}

export interface N1 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: any
    children: number[]
}

export interface N2 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: number[]
}

export interface N3 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: number[]
}

export interface N4 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: number[]
}

export interface N5 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: number[]
}

export interface N6 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: number[]
}

export interface N7 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: number[]
}

export interface N8 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: any
    children: number[]
}

export interface N9 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: number[]
}

export interface N10 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: number[]
}

export interface N11 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: number[]
}

export interface N12 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: number[]
}

export interface N13 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: number[]
}

export interface N14 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: number[]
}

export interface N16 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: number[]
}

export interface N17 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: number[]
}

export interface N18 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: number[]
}

export interface N19 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: any[]
}

export interface N21 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: any[]
}

export interface N22 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: any[]
}

export interface N23 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: number[]
}

export interface N24 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: any[]
}

export interface N25 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: any[]
}

export interface N26 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: number[]
}

export interface N27 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: any[]
}

export interface N28 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: any[]
}

export interface N29 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: any[]
}

export interface N35 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N36 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N37 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N38 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N39 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N40 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N41 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N42 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N43 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N44 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N45 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N46 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N47 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N48 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N49 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N50 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N51 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N52 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N53 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N54 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N55 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N56 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N57 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N58 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N59 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N60 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N61 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N62 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N63 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N64 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N65 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N66 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N67 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N68 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N69 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N70 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N71 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N72 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N73 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N74 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N75 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N76 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N77 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N78 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N79 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N80 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N81 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N82 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N83 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N84 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N85 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N86 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N87 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N88 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N89 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N90 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N91 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N92 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N93 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N94 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N95 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N96 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N97 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N98 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N99 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N100 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N101 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N102 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N103 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N104 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N105 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N106 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N107 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N108 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N109 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N110 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N111 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N113 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N114 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N115 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N116 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N117 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N118 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N119 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N120 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N121 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N122 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N123 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N124 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N125 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N126 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N127 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N128 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N129 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N130 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N131 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N132 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N133 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N134 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N135 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N136 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N137 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N138 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N139 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N140 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N141 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N142 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N143 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N144 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N145 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N146 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N147 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N148 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N149 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N150 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N151 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N152 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N153 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N154 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N155 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N156 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N157 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N158 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N159 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N160 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N161 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N162 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N163 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N164 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N165 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N166 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N167 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N168 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N169 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N170 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N171 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N172 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N173 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N174 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N175 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N176 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N177 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N178 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N179 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N180 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N181 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N182 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N183 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N184 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N185 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N186 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N187 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N188 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N189 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N190 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N191 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N192 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N193 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N194 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N195 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N196 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N197 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N200 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: any
    children: any[]
}

export interface N201 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N202 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N203 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N204 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N205 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N206 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N207 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N208 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N209 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N210 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N211 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N212 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N213 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N214 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N215 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N216 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N217 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N218 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N219 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N220 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N221 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N222 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N223 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N224 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N225 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N226 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N227 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface N228 {
    id: number
    name: string
    slug: string
    sizeGroups: any[]
    parentId: number
    children: any[]
}

export interface N229 {
    id: number
    name: string
    slug: string
    sizeGroups: number[]
    parentId: number
    children: any[]
}

export interface CategoryByPath {}

export interface CategoryNavigationTree {
    id?: number
    children: number[]
    label?: string
}

export interface ProductFetchCacheMeta {
    hash: string
    ttl: number
}

export interface Sitemap {
    items: any[]
    isFetching: boolean
    error: any
}

export interface Disputes {
    dashboardFetchState: string
    dashboardData: any[]
    dashboardRole: string
    dashboardStatus: string
    dashboardRequest: DashboardRequest
}

export interface DashboardRequest {
    limit: number
    raisedBy: string
    status: string
}

export interface Shop {
    seller: Seller2
    meta: Meta2
    products: any[]
    unfilteredProducts: any[]
    rearrange: Rearrange
    fetchState: string
    listType: string
}

export interface Seller2 {
    id: number
    picture: any
    first_name: string
    last_name: string
    username: string
    reviews_total: number
    reviews_rating: number
    followers: number
    following: number
    last_seen: string
    items_sold: number
    bio: string
    initials: string
    verified: boolean
    website: string
    isFollowing: boolean
    tagline: string
}

export interface Meta2 {
    end: boolean
    cursor: any
}

export interface Rearrange {
    order: any[]
    isRearranging: boolean
    isSaving: boolean
    isCancelling: boolean
    isCancelled: boolean
    isCompleted: boolean
}

export interface Feedback {
    sold: Sold
    purchased: Purchased
    fetchState: string
    sellerId: any
}

export interface Sold {
    meta: Meta3
    feedback: any[]
    hasError: boolean
}

export interface Meta3 {
    end: boolean
}

export interface Purchased {
    meta: Meta4
    feedback: any[]
    hasError: boolean
}

export interface Meta4 {
    end: boolean
}

export interface Follows {
    followers: Followers
    following: Following
    fetchState: string
    sellerId: any
}

export interface Followers {
    meta: Meta5
    users: any[]
    hasError: boolean
}

export interface Meta5 {
    end: boolean
}

export interface Following {
    meta: Meta6
    users: any[]
    hasError: boolean
}

export interface Meta6 {
    end: boolean
}

export interface Device {
    userAgent: string
}

export interface SellerOnboarding {
    sellerStatus: SellerStatus
}

export interface SellerStatus {
    fetchState: string
    isInitialData: boolean
    data: Data2
}

export interface Data2 {
    stripe: Stripe
    payPal: PayPal
    user: User2
}

export interface Stripe {
    isConnected: boolean
    isEligible: boolean
}

export interface PayPal {
    isConnected: boolean
}

export interface User2 {
    country: string
}

export interface Query2 {
    moduleOrigin: string
    slug: string
}

export interface RuntimeConfig {
    LEGACY_CLOUDFRONT_HOST: string
    DEPOP_CLOUDFRONT_HOST: string
    SITEMAP_CLOUDFRONT_HOST: string
    API_HOST: string
    ANALYTICS_FACEBOOK: string
    GOOGLE_API_CLIENT_ID: string
    GOOGLE_MEASUREMENT_ID: string
    APPLE_CLIENT_ID: string
    BRANCH_TOKEN: string
    SIGNUP_HOST: string
    NEXT_PUBLIC_SENTRY_DSN: string
    DEPLOY_ENV: string
    APP_VERSION: string
    SEGMENT_WRITE_KEY: string
    SEGMENT_ENABLED: string
    DD_RUM_APP_ID: string
    DD_RUM_CLIENT_TOKEN: string
    SIFT_BEACON_KEY: string
    PROD_HOST: string
    BRAZE_KEY: string
    DD_BROWSER_LOGS_SITE: string
    DD_BROWSER_LOGS_CLIENT_TOKEN: string
    ENV_TYPE: string
    ENV_NAME: string
    SERVICE_DOMAIN: string
    SERVICE_GROUP: string
    SERVICE_NAME: string
    SERVICE_ROLE: string
    SUPPORTED_LOCALES: string[]
    DEFAULT_LOCALE: string
    USE_LOCALE_ROUTING: string
    LOCALISED_ROUTES: string[]
    CONTENTFUL_PREVIEW_ENV: string
}