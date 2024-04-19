enum BILLING_PRODUCTS {
  FREE_TRIAL = "free_trial",
  PRO_BI_WEEKLY = "pro_bi_weekly",
  PRO_QUATERLY = "pro_quaterly",
  PRO_YEARLY = "pro_yearly",
}

enum CREDIT_PACKAGES {
  PACK_100 = "credit_pack_100",
  PACK_300 = "credit_pack_300",
  pack_500 = "credit_pack_500",
  PACK_1000 = "credit_pack_1000",
}

enum DEDUCT_TYPES {
  RESUME_DOWNLOAD = "resume_download",
  RESUME_PARSING = "resume_parsing"
}


const CREDITS_MAP: any = {
    [BILLING_PRODUCTS.FREE_TRIAL]: 90,
    [BILLING_PRODUCTS.PRO_BI_WEEKLY]: 100,
    [BILLING_PRODUCTS.PRO_QUATERLY]: 720,
    [BILLING_PRODUCTS.PRO_YEARLY]: 3600,
    [CREDIT_PACKAGES.PACK_100]: 100,
    [CREDIT_PACKAGES.PACK_300]: 300,
    [CREDIT_PACKAGES.pack_500]: 500,
    [CREDIT_PACKAGES.PACK_1000]: 1000,
}

const BILLING_PRICE_ID : any = {
    [BILLING_PRODUCTS.PRO_BI_WEEKLY]: "price_1P6vLQRwhIDHSWqApKNiAUBN", 
    [BILLING_PRODUCTS.PRO_QUATERLY]: "price_1P6vLiRwhIDHSWqA2VBui9rx",
    [BILLING_PRODUCTS.PRO_YEARLY]: "price_1P6vObRwhIDHSWqA5BBcNigv",
}

const CREDIT_PACKAGES_PRICE_ID : any = {
    [CREDIT_PACKAGES.PACK_100]: "price_1P7C20RwhIDHSWqA0NTE8q2v",
    [CREDIT_PACKAGES.PACK_300]: "price_1P7C2KRwhIDHSWqALLyUHPmt",
    [CREDIT_PACKAGES.pack_500]: "price_1P7C2gRwhIDHSWqAHWHeYjrS",
    [CREDIT_PACKAGES.PACK_1000]: "price_1P7C32RwhIDHSWqANTxarYyY",
}

export { BILLING_PRODUCTS, CREDIT_PACKAGES, DEDUCT_TYPES, CREDITS_MAP, BILLING_PRICE_ID, CREDIT_PACKAGES_PRICE_ID };