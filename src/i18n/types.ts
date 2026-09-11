/**
 * Dictionary sxemi — bütün dillərin (az/en/ru) uyğun olmalı olduğu struktur.
 *
 * `string` tipli leaf-lər saxlayır ki, hər dil öz mətnini yaza bilsin (literal
 * tiplər YOX — yalnız `az.ts` "doğru struktur" mənbəyi olsun deyə). Bir dil
 * açar əskik saxlasa, TypeScript compile zamanı xəta verir (bax: dictionaries/*.ts).
 */
export interface AboutPillar {
  title: string;
  description: string;
}

export interface AboutTech {
  name: string;
  role: string;
  category: string;
}

export interface AboutHighlight {
  title: string;
  desc: string;
}

export interface Dictionary {
  meta: {
    siteName: string;
    domainSuffix: string;
    titleTemplate: string;
    defaultTitle: string;
    defaultDescription: string;
    homeTitle: string;
    aboutTitle: string;
    aboutDescription: string;
    loginTitle: string;
    loginDescription: string;
    registerTitle: string;
    registerDescription: string;
    myPostsTitle: string;
    myPostsDescription: string;
    newPostTitle: string;
    newPostDescription: string;
    editPostTitlePrefix: string;
    postNotFound: string;
    settingsTitle: string;
    settingsDescription: string;
  };
  nav: {
    writings: string;
    about: string;
    newPost: string;
    login: string;
    register: string;
    search: string;
    searchAria: string;
    myPosts: string;
    settings: string;
    signOut: string;
  };
  footer: {
    tagline: string;
    writings: string;
    about: string;
    github: string;
    rights: string;
  };
  theme: {
    label: string;
    light: string;
    dark: string;
    system: string;
    toggleAria: string;
  };
  language: {
    label: string;
    switchAria: string;
  };
  home: {
    srTitle: string;
    featuredLabel: string;
    resultsFor: string;
    backToArchive: string;
    allPosts: string;
    results: string;
    endOfArchive: string;
    loadingMore: string;
    comingSoon: string;
    noPostsYetTitle: string;
    noPostsYetDesc: string;
    writeNewPost: string;
    noResultsTitle: string;
    noResultsDesc: string;
    resetFilters: string;
    readAction: string;
    hamisi: string;
  };
  postMeta: {
    readingMinutes: string;
  };
  search: {
    filterLabel: string;
    placeholder: string;
    clearAria: string;
    siteWideHint: string;
    resetLabel: string;
  };
  spotlight: {
    dialogAria: string;
    inputAria: string;
    placeholder: string;
    minCharsHint: string;
    noResultsFor: string;
    allResultsFor: string;
    navHint: string;
    openHint: string;
    title: string;
    triggerAria: string;
  };
  viewToggle: {
    groupAria: string;
    gridLabel: string;
    gridHint: string;
    listLabel: string;
    listHint: string;
  };
  blogChrome: {
    home: string;
    posts: string;
    reading: string;
  };
  post: {
    editButton: string;
    authorBadge: string;
    adminBadge: string;
    backToAll: string;
    categoryLabel: string;
    defaultAuthorName: string;
    defaultAuthorEmail: string;
  };
  deletePost: {
    delete: string;
    confirm: string;
    deleting: string;
    cancel: string;
    ariaDelete: string;
    ariaConfirm: string;
    ariaDeleting: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    loginTab: string;
    registerTab: string;
    emailLabel: string;
    emailPlaceholderLogin: string;
    emailPlaceholderRegister: string;
    passwordLabel: string;
    passwordPlaceholderLogin: string;
    passwordPlaceholderRegister: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    loginButton: string;
    loginLoading: string;
    registerButton: string;
    registerLoading: string;
    noAccount: string;
    haveAccount: string;
    switchToRegister: string;
    switchToLogin: string;
    securityNote: string;
    showPassword: string;
    hidePassword: string;
  };
  validation: {
    passwordRequired: string;
    passwordMin: string;
    passwordMax: string;
    passwordLetter: string;
    passwordDigit: string;
    nameRequired: string;
    nameMin: string;
    nameMax: string;
    emailRequired: string;
    emailInvalid: string;
    confirmPasswordRequired: string;
    passwordsMismatch: string;
    loginPasswordRequired: string;
    titleRequired: string;
    titleMin: string;
    titleMax: string;
    categoryInvalid: string;
    excerptRequired: string;
    excerptMin: string;
    excerptMax: string;
    contentRequired: string;
    contentMin: string;
    contentMax: string;
    coverImageInvalid: string;
    avatarInvalid: string;
  };
  authActions: {
    registerGenericError: string;
    registerSystemError: string;
    invalidCredentials: string;
    loginSystemError: string;
    mustBeLoggedIn: string;
    signOutOthersFailed: string;
    signOutOthersSuccess: string;
  };
  postActions: {
    mustBeLoggedInPublish: string;
    mustBeLoggedInEdit: string;
    mustBeLoggedInDelete: string;
    titleTaken: string;
    createFailed: string;
    postNotFound: string;
    noEditPermission: string;
    noDeletePermission: string;
    slugTaken: string;
    slugTakenField: string;
    slugTakenFieldUpdate: string;
    updateFailed: string;
    deleteFailed: string;
    missingId: string;
  };
  profileActions: {
    mustBeLoggedIn: string;
    updateFailed: string;
  };
  uploadActions: {
    mustBeLoggedIn: string;
    uploadFailed: string;
  };
  postForm: {
    titleLabel: string;
    titlePlaceholder: string;
    linkPreviewLabel: string;
    slugLabel: string;
    slugPlaceholder: string;
    finalUrlLabel: string;
    slugChangeWarning: string;
    coverImageLabel: string;
    coverImageHelp: string;
    categoryLabel: string;
    excerptLabel: string;
    excerptPlaceholder: string;
    contentLabel: string;
    contentHint: string;
    contentPlaceholder: string;
  };
  myPosts: {
    authorPanel: string;
    title: string;
    subtitle: string;
    newPost: string;
    totalPosts: string;
    authorStatus: string;
    admin: string;
    author: string;
    accountEmail: string;
    noPostsTitle: string;
    noPostsDesc: string;
    firstPost: string;
    view: string;
    viewAria: string;
    edit: string;
    editAria: string;
    readingMinutes: string;
  };
  newPost: {
    back: string;
    authorBadge: string;
    title: string;
    subtitle: string;
    submit: string;
    submitLoading: string;
  };
  editPost: {
    back: string;
    modeBadge: string;
    title: string;
    subtitle: string;
    submit: string;
    submitLoading: string;
  };
  settings: {
    sectionLabel: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    statusLabel: string;
    emailLabel: string;
    profileTitle: string;
    profileSubtitle: string;
    securityTitle: string;
    signOutOthersTitle: string;
    signOutOthersDesc: string;
    memberSince: string;
    appearanceTitle: string;
    appearanceSubtitle: string;
    languageTitle: string;
    languageSubtitle: string;
  };
  signOutOthers: {
    button: string;
    confirm: string;
    loading: string;
    cancel: string;
    ariaDefault: string;
    ariaArmed: string;
    ariaLoading: string;
  };
  avatarSettings: {
    label: string;
    helpText: string;
    updated: string;
    save: string;
    saving: string;
  };
  imageUpload: {
    invalidType: string;
    tooLarge: string;
    genericError: string;
    removeImage: string;
    defaultHelp: string;
  };
  userMenu: {
    myPosts: string;
    newPost: string;
    settings: string;
    signOut: string;
  };
  loading: {
    root: string;
    about: string;
    blogPost: string;
    myPosts: string;
    newPost: string;
    editPost: string;
    settings: string;
    generic: string;
  };
  sidebar: {
    authorOfPost: string;
    sharedPosts: string;
    memberSince: string;
    activeMember: string;
    findMoreByAuthor: string;
    articleOverview: string;
    readingTime: string;
    readingTimeUnit: string;
    category: string;
    wordCount: string;
    wordCountUnit: string;
    topicsAndTags: string;
    all: string;
    communityTitle: string;
    communityDesc: string;
    communityCta: string;
  };
  about: {
    heroTag: string;
    heroTitle: string;
    heroDesc: string;
    readPosts: string;
    publishPost: string;
    whyLabel: string;
    whyTitle: string;
    pillars: AboutPillar[];
    infraLabel: string;
    techTitle: string;
    techDesc: string;
    tech: AboutTech[];
    detailsLabel: string;
    archTitle: string;
    highlights: AboutHighlight[];
    backToAll: string;
    journalTag: string;
  };
  months: string[];
  monthsShort: string[];
}
