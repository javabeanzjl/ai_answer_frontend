declare namespace API {
  type AiGenerateQuestionRequest = {
    appId?: number;
    optionNum?: number;
    questionNum?: number;
    userId?: number;
  };

  type aiGenerateQuestionSSEUsingGETParams = {
    appId?: number;
    optionNum?: number;
    questionNum?: number;
    userId?: number;
  };

  type AiGenerateScoringResultRequest = {
    appId?: number;
    scoringResultNum?: number;
  };

  type App = {
    appDesc?: string;
    appIcon?: string;
    appName?: string;
    appType?: number;
    createTime?: string;
    id?: number;
    isDelete?: number;
    reviewMessage?: string;
    reviewStatus?: number;
    reviewTime?: string;
    reviewerId?: number;
    scoringStrategy?: number;
    updateTime?: string;
    userId?: number;
  };

  type AppAddRequest = {
    appDesc?: string;
    appIcon?: string;
    appName?: string;
    appType?: number;
    scoringStrategy?: number;
  };

  type AppEditRequest = {
    appDesc?: string;
    appIcon?: string;
    appName?: string;
    appType?: number;
    id?: number;
    scoringStrategy?: number;
  };

  type AppQueryRequest = {
    appDesc?: string;
    appName?: string;
    appType?: number;
    current?: number;
    id?: number;
    pageSize?: number;
    reviewStatus?: number;
    reviewerId?: number;
    scoringStrategy?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type AppTypeDistribution = {
    appCount?: number;
    appType?: number;
  };

  type AppUpdateRequest = {
    appDesc?: string;
    appIcon?: string;
    appName?: string;
    appType?: number;
    id?: number;
    reviewMessage?: string;
    reviewStatus?: number;
    reviewTime?: string;
    reviewerId?: number;
    scoringStrategy?: number;
  };

  type AppVO = {
    appDesc?: string;
    appIcon?: string;
    appName?: string;
    appType?: number;
    createTime?: string;
    id?: number;
    reviewMessage?: string;
    reviewStatus?: number;
    reviewTime?: string;
    reviewerId?: number;
    scoringStrategy?: number;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
  };

  type BaseResponseAppVO_ = {
    code?: number;
    data?: AppVO;
    message?: string;
  };

  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseInt_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseListAppTypeDistribution_ = {
    code?: number;
    data?: AppTypeDistribution[];
    message?: string;
  };

  type BaseResponseListHotAppDistribution_ = {
    code?: number;
    data?: HotAppDistribution[];
    message?: string;
  };

  type BaseResponseListReviewPassRateDistribution_ = {
    code?: number;
    data?: ReviewPassRateDistribution[];
    message?: string;
  };

  type BaseResponseListScoringResultVO_ = {
    code?: number;
    data?: ScoringResultVO[];
    message?: string;
  };

  type BaseResponseListScoringStrategyDistribution_ = {
    code?: number;
    data?: ScoringStrategyDistribution[];
    message?: string;
  };

  type BaseResponseListUserAnswerParticipation_ = {
    code?: number;
    data?: UserAnswerParticipation[];
    message?: string;
  };

  type BaseResponseListUserVO_ = {
    code?: number;
    data?: UserVO[];
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageApp_ = {
    code?: number;
    data?: PageApp_;
    message?: string;
  };

  type BaseResponsePageAppVO_ = {
    code?: number;
    data?: PageAppVO_;
    message?: string;
  };

  type BaseResponsePageQuestion_ = {
    code?: number;
    data?: PageQuestion_;
    message?: string;
  };

  type BaseResponsePageQuestionVO_ = {
    code?: number;
    data?: PageQuestionVO_;
    message?: string;
  };

  type BaseResponsePageScoringResult_ = {
    code?: number;
    data?: PageScoringResult_;
    message?: string;
  };

  type BaseResponsePageScoringResultVO_ = {
    code?: number;
    data?: PageScoringResultVO_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponsePageUserAnswer_ = {
    code?: number;
    data?: PageUserAnswer_;
    message?: string;
  };

  type BaseResponsePageUserAnswerVO_ = {
    code?: number;
    data?: PageUserAnswerVO_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponseQuestionVO_ = {
    code?: number;
    data?: QuestionVO;
    message?: string;
  };

  type BaseResponseScoringResultVO_ = {
    code?: number;
    data?: ScoringResultVO;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUserAnswerGrowthRecord_ = {
    code?: number;
    data?: UserAnswerGrowthRecord;
    message?: string;
  };

  type BaseResponseUserAnswerVO_ = {
    code?: number;
    data?: UserAnswerVO;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type createQuestionByAiUsingPOSTParams = {
    /** id */
    id?: number;
  };

  type DeleteRequest = {
    id?: number;
  };

  type getAppVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getInvokeCountUsingGETParams = {
    /** id */
    id?: number;
  };

  type getQuestionVOByAppIdUsingPOSTParams = {
    /** appId */
    appId?: number;
  };

  type getQuestionVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getScoringResultVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getScoringResultVOListByAppIdUsingPOSTParams = {
    /** appId */
    appId?: number;
  };

  type getUserAnswerVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type HotAppDistribution = {
    answerCount?: number;
    appId?: number;
  };

  type Option = {
    key?: string;
    result?: string;
    score?: number;
    value?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageApp_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: App[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageAppVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: AppVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestion_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Question[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageScoringResult_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: ScoringResult[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageScoringResultVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: ScoringResultVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserAnswer_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserAnswer[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserAnswerVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserAnswerVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type Question = {
    appId?: number;
    createTime?: string;
    id?: number;
    isDelete?: number;
    questionContent?: string;
    updateTime?: string;
    userId?: number;
  };

  type QuestionAddRequest = {
    appId?: number;
    id?: number;
    questionContentDTOList?: QuestionContentDTO[];
  };

  type QuestionContentDTO = {
    options?: Option[];
    title?: string;
  };

  type QuestionEditRequest = {
    id?: number;
    questionContentDTOList?: QuestionContentDTO[];
  };

  type QuestionQueryRequest = {
    appId?: number;
    current?: number;
    id?: number;
    pageSize?: number;
    questionContent?: string;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type QuestionUpdateRequest = {
    appId?: number;
    current?: number;
    id?: number;
    pageSize?: number;
    questionContentDTOList?: QuestionContentDTO[];
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type QuestionVO = {
    appId?: number;
    createTime?: string;
    id?: number;
    questionContent?: QuestionContentDTO[];
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
  };

  type ReviewPassRateDistribution = {
    appCount?: number;
    reviewStatus?: number;
  };

  type ScoringResult = {
    appId?: number;
    createTime?: string;
    id?: number;
    isDelete?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string;
    resultScoreRange?: number;
    updateTime?: string;
    userId?: number;
  };

  type ScoringResultAddRequest = {
    appId?: number;
    id?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string[];
    resultScoreRange?: number;
    userId?: number;
  };

  type ScoringResultEditRequest = {
    id?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string[];
    resultScoreRange?: number;
  };

  type ScoringResultQueryRequest = {
    appId?: number;
    current?: number;
    id?: number;
    pageSize?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string;
    resultScoreRange?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type ScoringResultUpdateRequest = {
    id?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string[];
    resultScoreRange?: number;
  };

  type ScoringResultVO = {
    appId?: number;
    createTime?: string;
    id?: number;
    resultDesc?: string;
    resultName?: string;
    resultPicture?: string;
    resultProp?: string[];
    resultScoreRange?: number;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
  };

  type ScoringStrategyDistribution = {
    appCount?: number;
    scoringStrategy?: number;
  };

  type SseEmitter = {
    timeout?: number;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    createTime?: string;
    id?: number;
    invokeCount?: number;
    isDelete?: number;
    mpOpenId?: string;
    unionId?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    gender?: number;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserAnswer = {
    appId?: number;
    appType?: number;
    choices?: string;
    createTime?: string;
    id?: number;
    isDelete?: number;
    resultDesc?: string;
    resultId?: number;
    resultName?: string;
    resultPicture?: string;
    resultScore?: number;
    scoringStrategy?: number;
    updateTime?: string;
    userId?: number;
  };

  type UserAnswerAddRequest = {
    appId?: number;
    choices?: string[];
    id?: number;
  };

  type UserAnswerEditRequest = {
    appId?: number;
    choices?: string[];
    id?: number;
  };

  type UserAnswerGrowthRecord = {
    dayIncPercent?: number;
    userAnswerCount?: number;
    wekIncPercent?: number;
  };

  type UserAnswerParticipation = {
    appId?: number;
    participationRate?: number;
    totalAnswerCount?: number;
    uniqueUserCount?: number;
  };

  type UserAnswerQueryRequest = {
    appId?: number;
    appType?: number;
    choices?: string;
    current?: number;
    id?: number;
    pageSize?: number;
    resultDesc?: string;
    resultId?: number;
    resultName?: string;
    resultPicture?: string;
    resultScore?: number;
    scoringStrategy?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type UserAnswerUpdateRequest = {
    appId?: number;
    choices?: string[];
    id?: number;
  };

  type UserAnswerVO = {
    appId?: number;
    appType?: number;
    choices?: string[];
    createTime?: string;
    id?: number;
    resultDesc?: string;
    resultId?: number;
    resultName?: string;
    resultPicture?: string;
    resultScore?: number;
    scoringStrategy?: number;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type UserDeleteRequest = {
    id?: number;
  };

  type UserLoginRequest = {
    userAccount: string;
    userPassword: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userAccount?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword: string;
    userAccount: string;
    userPassword: string;
  };

  type UserUpdateRequest = {
    gender?: number;
    id?: number;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: number;
    invokeCount?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type validateUserInvokeCountUsingGETParams = {
    /** id */
    id?: number;
  };
}
