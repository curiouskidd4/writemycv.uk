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
  RESUME_UPLOAD = "resume_upload"
}


const CREDITS_MAP: any = {
    [BILLING_PRODUCTS.FREE_TRIAL]: 90,
    [BILLING_PRODUCTS.PRO_BI_WEEKLY]: 100,
    [BILLING_PRODUCTS.PRO_QUATERLY]: 120,
    [BILLING_PRODUCTS.PRO_YEARLY]: 150,
    [CREDIT_PACKAGES.PACK_100]: 100,
    [CREDIT_PACKAGES.PACK_300]: 300,
    [CREDIT_PACKAGES.pack_500]: 500,
    [CREDIT_PACKAGES.PACK_1000]: 1000,
}

const BILLING_PRICE_ID : any = {
    [BILLING_PRODUCTS.PRO_BI_WEEKLY]: "price_1P3k8zSHT210NSXLloFRLMHs", 
    [BILLING_PRODUCTS.PRO_QUATERLY]: "price_1P3kA0SHT210NSXL4qNPrVkf",
    [BILLING_PRODUCTS.PRO_YEARLY]: "price_1P3kAPSHT210NSXLXCnQuFVV",
}

const CREDIT_PACKAGES_PRICE_ID : any = {
    [CREDIT_PACKAGES.PACK_100]: "price_1P3kEkSHT210NSXLSpijxXw0",
    [CREDIT_PACKAGES.PACK_300]: "price_1P3kFLSHT210NSXLm00HoXoH",
    [CREDIT_PACKAGES.pack_500]: "price_1P3kFxSHT210NSXL3ER8qjRA",
    [CREDIT_PACKAGES.PACK_1000]: "price_1P3kGSSHT210NSXL9yMwSdGH",
}

export { BILLING_PRODUCTS, CREDIT_PACKAGES, DEDUCT_TYPES, CREDITS_MAP, BILLING_PRICE_ID, CREDIT_PACKAGES_PRICE_ID };