import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import validator from 'validator';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// DECIMAL
//------------------------------------------------------

export const DecimalJSLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({ d: z.array(z.number()), e: z.number(), s: z.number(), toFixed: z.function().args().returns(z.string()), });

export const DecimalJSLikeListSchema: z.ZodType<Prisma.DecimalJsLike[]> = z.object({ d: z.array(z.number()), e: z.number(), s: z.number(), toFixed: z.function().args().returns(z.string()), }).array();

export const DECIMAL_STRING_REGEX = /^[0-9.,e+-bxffo_cp]+$|Infinity|NaN/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const ClientAddressScalarFieldEnumSchema = z.enum(['clientId','address','state','city','country','zip','updatedAt']);

export const ClientEmailScalarFieldEnumSchema = z.enum(['email','clientId','description','type','updatedAt']);

export const ClientPhoneScalarFieldEnumSchema = z.enum(['phone','clientId','description','updatedAt','type']);

export const ClientSalesRepCompanyScalarFieldEnumSchema = z.enum(['clientId','salesRepUsername','companyId','fromDate','toDate','isActive']);

export const ClientScalarFieldEnumSchema = z.enum(['id','name','companyName','createdAt','addTransactionCharges','updatedAt','payMethod','currency','status','notes','salesRepUsername','companyId']);

export const ColorSettingsScalarFieldEnumSchema = z.enum(['salesRepUsername','accentColor','primaryColor','secondaryColor','auxiliaryColor','theme']);

export const CompanyScalarFieldEnumSchema = z.enum(['id','name','address','city','state','country','zip','phone','email','website']);

export const GmailMsgScalarFieldEnumSchema = z.enum(['threadId','inboxMsgId','jobId','direction']);

export const JobScalarFieldEnumSchema = z.enum(['id','name','price','createdAt','updatedAt','type','status','vendorId','purchaseOrderId']);

export const KeyScalarFieldEnumSchema = z.enum(['id','hashed_password','user_id','primary','expires']);

export const PurchaseOrderScalarFieldEnumSchema = z.enum(['id','clientId','primaryJobId']);

export const SalesRepScalarFieldEnumSchema = z.enum(['id','username','name','email','phone','companyId']);

export const SessionScalarFieldEnumSchema = z.enum(['id','user_id','active_expires','idle_expires']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','username','role']);

export const UserSettingsScalarFieldEnumSchema = z.enum(['username','settings']);

export const VendorScalarFieldEnumSchema = z.enum(['id','updatedAt','createdAt','email','name','department','status']);

export const JobTypeSchema = z.enum(['JOB','REVISION','QUOTE','CREDIT']);

export type JobTypeType = `${z.infer<typeof JobTypeSchema>}`

export const JobStatusSchema = z.enum(['PENDING','RUSH','COMPLETED','CANCELLED']);

export type JobStatusType = `${z.infer<typeof JobStatusSchema>}`

export const ClientStatusSchema = z.enum(['ACTIVE','INACTIVE','RETIRED']);

export type ClientStatusType = `${z.infer<typeof ClientStatusSchema>}`

export const VendorStatusSchema = z.enum(['ACTIVE','INACTIVE']);

export type VendorStatusType = `${z.infer<typeof VendorStatusSchema>}`

export const EmailTypeSchema = z.enum(['JOB','INVOICE']);

export type EmailTypeType = `${z.infer<typeof EmailTypeSchema>}`

export const PhoneTypeSchema = z.enum(['PRIMARY','SECONDARY']);

export type PhoneTypeType = `${z.infer<typeof PhoneTypeSchema>}`

export const CurrencySchema = z.enum(['USD','CAD']);

export type CurrencyType = `${z.infer<typeof CurrencySchema>}`

export const DepartmentSchema = z.enum(['DIGITIZING','VECTOR','PATCH']);

export type DepartmentType = `${z.infer<typeof DepartmentSchema>}`

export const PayMethodSchema = z.enum(['CHECK','PAYPAL','CREDIT_CARD','ONLINE','UNKNOWN']);

export type PayMethodType = `${z.infer<typeof PayMethodSchema>}`

export const EmailDirectionSchema = z.enum(['BACKWARD','FORWARD']);

export type EmailDirectionType = `${z.infer<typeof EmailDirectionSchema>}`

export const UserRolesSchema = z.enum(['ADMIN','USER','MANAGER']);

export type UserRolesType = `${z.infer<typeof UserRolesSchema>}`

export const ThemeSchema = z.enum(['white','g10','g80','g90','g100']);

export type ThemeType = `${z.infer<typeof ThemeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CLIENT SCHEMA
/////////////////////////////////////////

export const ClientSchema = z.object({
  payMethod: PayMethodSchema,
  currency: CurrencySchema,
  status: ClientStatusSchema,
  id: z.string().min(1).max(32),
  name: z.string().min(1).max(60),
  companyName: z.string().min(1).max(100),
  createdAt: z.coerce.date(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date(),
  notes: z.string().nullish(),
  salesRepUsername: z.string().min(2).max(20).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' }),
})

export type Client = z.infer<typeof ClientSchema>

// CLIENT OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ClientOptionalDefaultsSchema = ClientSchema.merge(z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type ClientOptionalDefaults = z.infer<typeof ClientOptionalDefaultsSchema>

// CLIENT RELATION SCHEMA
//------------------------------------------------------

export type ClientRelations = {
  emails: ClientEmailWithRelations[];
  phones: ClientPhoneWithRelations[];
  orders: PurchaseOrderWithRelations[];
  clientSalesRepCompany: ClientSalesRepCompanyWithRelations[];
  salesRep: SalesRepWithRelations;
  company: CompanyWithRelations;
  clientAddress?: ClientAddressWithRelations | null;
};

export type ClientWithRelations = z.infer<typeof ClientSchema> & ClientRelations

export const ClientWithRelationsSchema: z.ZodType<ClientWithRelations> = ClientSchema.merge(z.object({
  emails: z.lazy(() => ClientEmailWithRelationsSchema).array(),
  phones: z.lazy(() => ClientPhoneWithRelationsSchema).array(),
  orders: z.lazy(() => PurchaseOrderWithRelationsSchema).array(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyWithRelationsSchema).array(),
  salesRep: z.lazy(() => SalesRepWithRelationsSchema),
  company: z.lazy(() => CompanyWithRelationsSchema),
  clientAddress: z.lazy(() => ClientAddressWithRelationsSchema).nullish(),
}))

// CLIENT OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ClientOptionalDefaultsWithRelations = z.infer<typeof ClientOptionalDefaultsSchema> & ClientRelations

export const ClientOptionalDefaultsWithRelationsSchema: z.ZodType<ClientOptionalDefaultsWithRelations> = ClientOptionalDefaultsSchema.merge(z.object({
  emails: z.lazy(() => ClientEmailWithRelationsSchema).array(),
  phones: z.lazy(() => ClientPhoneWithRelationsSchema).array(),
  orders: z.lazy(() => PurchaseOrderWithRelationsSchema).array(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyWithRelationsSchema).array(),
  salesRep: z.lazy(() => SalesRepWithRelationsSchema),
  company: z.lazy(() => CompanyWithRelationsSchema),
  clientAddress: z.lazy(() => ClientAddressWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// VENDOR SCHEMA
/////////////////////////////////////////

export const VendorSchema = z.object({
  department: DepartmentSchema,
  status: VendorStatusSchema,
  id: z.number().int(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  email: z.string(),
  name: z.string(),
})

export type Vendor = z.infer<typeof VendorSchema>

// VENDOR OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const VendorOptionalDefaultsSchema = VendorSchema.merge(z.object({
  id: z.number().int().optional(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
}))

export type VendorOptionalDefaults = z.infer<typeof VendorOptionalDefaultsSchema>

// VENDOR RELATION SCHEMA
//------------------------------------------------------

export type VendorRelations = {
  orders: JobWithRelations[];
};

export type VendorWithRelations = z.infer<typeof VendorSchema> & VendorRelations

export const VendorWithRelationsSchema: z.ZodType<VendorWithRelations> = VendorSchema.merge(z.object({
  orders: z.lazy(() => JobWithRelationsSchema).array(),
}))

// VENDOR OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type VendorOptionalDefaultsWithRelations = z.infer<typeof VendorOptionalDefaultsSchema> & VendorRelations

export const VendorOptionalDefaultsWithRelationsSchema: z.ZodType<VendorOptionalDefaultsWithRelations> = VendorOptionalDefaultsSchema.merge(z.object({
  orders: z.lazy(() => JobWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// GMAIL MSG SCHEMA
/////////////////////////////////////////

export const GmailMsgSchema = z.object({
  direction: EmailDirectionSchema,
  threadId: z.string(),
  inboxMsgId: z.string(),
  jobId: z.string(),
})

export type GmailMsg = z.infer<typeof GmailMsgSchema>

// GMAIL MSG RELATION SCHEMA
//------------------------------------------------------

export type GmailMsgRelations = {
  job: JobWithRelations;
};

export type GmailMsgWithRelations = z.infer<typeof GmailMsgSchema> & GmailMsgRelations

export const GmailMsgWithRelationsSchema: z.ZodType<GmailMsgWithRelations> = GmailMsgSchema.merge(z.object({
  job: z.lazy(() => JobWithRelationsSchema),
}))

/////////////////////////////////////////
// JOB SCHEMA
/////////////////////////////////////////

export const JobSchema = z.object({
  type: JobTypeSchema,
  status: JobStatusSchema,
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: "Field 'price' must be a Decimal. Location: ['Models', 'Job']",  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  vendorId: z.number().int(),
  purchaseOrderId: z.number().int(),
})

export type Job = z.infer<typeof JobSchema>

// JOB OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const JobOptionalDefaultsSchema = JobSchema.merge(z.object({
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type JobOptionalDefaults = z.infer<typeof JobOptionalDefaultsSchema>

// JOB RELATION SCHEMA
//------------------------------------------------------

export type JobRelations = {
  GmailMsgs: GmailMsgWithRelations[];
  purchaseOrder: PurchaseOrderWithRelations;
  vendor: VendorWithRelations;
  PurchaseOrder?: PurchaseOrderWithRelations | null;
};

export type JobWithRelations = z.infer<typeof JobSchema> & JobRelations

export const JobWithRelationsSchema: z.ZodType<JobWithRelations> = JobSchema.merge(z.object({
  GmailMsgs: z.lazy(() => GmailMsgWithRelationsSchema).array(),
  purchaseOrder: z.lazy(() => PurchaseOrderWithRelationsSchema),
  vendor: z.lazy(() => VendorWithRelationsSchema),
  PurchaseOrder: z.lazy(() => PurchaseOrderWithRelationsSchema).nullish(),
}))

// JOB OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type JobOptionalDefaultsWithRelations = z.infer<typeof JobOptionalDefaultsSchema> & JobRelations

export const JobOptionalDefaultsWithRelationsSchema: z.ZodType<JobOptionalDefaultsWithRelations> = JobOptionalDefaultsSchema.merge(z.object({
  GmailMsgs: z.lazy(() => GmailMsgWithRelationsSchema).array(),
  purchaseOrder: z.lazy(() => PurchaseOrderWithRelationsSchema),
  vendor: z.lazy(() => VendorWithRelationsSchema),
  PurchaseOrder: z.lazy(() => PurchaseOrderWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// PURCHASE ORDER SCHEMA
/////////////////////////////////////////

export const PurchaseOrderSchema = z.object({
  id: z.number().int(),
  clientId: z.string(),
  primaryJobId: z.string().nullish(),
})

export type PurchaseOrder = z.infer<typeof PurchaseOrderSchema>

// PURCHASE ORDER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const PurchaseOrderOptionalDefaultsSchema = PurchaseOrderSchema.merge(z.object({
  id: z.number().int().optional(),
}))

export type PurchaseOrderOptionalDefaults = z.infer<typeof PurchaseOrderOptionalDefaultsSchema>

// PURCHASE ORDER RELATION SCHEMA
//------------------------------------------------------

export type PurchaseOrderRelations = {
  jobs: JobWithRelations[];
  client: ClientWithRelations;
  primaryJob?: JobWithRelations | null;
};

export type PurchaseOrderWithRelations = z.infer<typeof PurchaseOrderSchema> & PurchaseOrderRelations

export const PurchaseOrderWithRelationsSchema: z.ZodType<PurchaseOrderWithRelations> = PurchaseOrderSchema.merge(z.object({
  jobs: z.lazy(() => JobWithRelationsSchema).array(),
  client: z.lazy(() => ClientWithRelationsSchema),
  primaryJob: z.lazy(() => JobWithRelationsSchema).nullish(),
}))

// PURCHASE ORDER OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type PurchaseOrderOptionalDefaultsWithRelations = z.infer<typeof PurchaseOrderOptionalDefaultsSchema> & PurchaseOrderRelations

export const PurchaseOrderOptionalDefaultsWithRelationsSchema: z.ZodType<PurchaseOrderOptionalDefaultsWithRelations> = PurchaseOrderOptionalDefaultsSchema.merge(z.object({
  jobs: z.lazy(() => JobWithRelationsSchema).array(),
  client: z.lazy(() => ClientWithRelationsSchema),
  primaryJob: z.lazy(() => JobWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// SALES REP SCHEMA
/////////////////////////////////////////

export const SalesRepSchema = z.object({
  id: z.number().int(),
  username: z.string().min(2).max(10).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),
  name: z.string(),
  email: z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),
  phone: z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' }),
})

export type SalesRep = z.infer<typeof SalesRepSchema>

// SALES REP OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const SalesRepOptionalDefaultsSchema = SalesRepSchema.merge(z.object({
  id: z.number().int().optional(),
}))

export type SalesRepOptionalDefaults = z.infer<typeof SalesRepOptionalDefaultsSchema>

// SALES REP RELATION SCHEMA
//------------------------------------------------------

export type SalesRepRelations = {
  company: CompanyWithRelations;
  user: UserWithRelations;
  clientSalesRepCompany: ClientSalesRepCompanyWithRelations[];
  client: ClientWithRelations[];
  SalesRepColors: ColorSettingsWithRelations[];
};

export type SalesRepWithRelations = z.infer<typeof SalesRepSchema> & SalesRepRelations

export const SalesRepWithRelationsSchema: z.ZodType<SalesRepWithRelations> = SalesRepSchema.merge(z.object({
  company: z.lazy(() => CompanyWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyWithRelationsSchema).array(),
  client: z.lazy(() => ClientWithRelationsSchema).array(),
  SalesRepColors: z.lazy(() => ColorSettingsWithRelationsSchema).array(),
}))

// SALES REP OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type SalesRepOptionalDefaultsWithRelations = z.infer<typeof SalesRepOptionalDefaultsSchema> & SalesRepRelations

export const SalesRepOptionalDefaultsWithRelationsSchema: z.ZodType<SalesRepOptionalDefaultsWithRelations> = SalesRepOptionalDefaultsSchema.merge(z.object({
  company: z.lazy(() => CompanyWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyWithRelationsSchema).array(),
  client: z.lazy(() => ClientWithRelationsSchema).array(),
  SalesRepColors: z.lazy(() => ColorSettingsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// COLOR SETTINGS SCHEMA
/////////////////////////////////////////

export const ColorSettingsSchema = z.object({
  theme: ThemeSchema,
  salesRepUsername: z.string().min(2).max(2).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),
  accentColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  primaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  secondaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  auxiliaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
})

export type ColorSettings = z.infer<typeof ColorSettingsSchema>

// COLOR SETTINGS RELATION SCHEMA
//------------------------------------------------------

export type ColorSettingsRelations = {
  salesRep: SalesRepWithRelations;
};

export type ColorSettingsWithRelations = z.infer<typeof ColorSettingsSchema> & ColorSettingsRelations

export const ColorSettingsWithRelationsSchema: z.ZodType<ColorSettingsWithRelations> = ColorSettingsSchema.merge(z.object({
  salesRep: z.lazy(() => SalesRepWithRelationsSchema),
}))

/////////////////////////////////////////
// USER SETTINGS SCHEMA
/////////////////////////////////////////

export const UserSettingsSchema = z.object({
  username: z.string(),
  settings: z.string().min(2).max(5000).refine((v) => validator.isJSON(v), { message: 'Invalid settings object' }),
})

export type UserSettings = z.infer<typeof UserSettingsSchema>

// USER SETTINGS RELATION SCHEMA
//------------------------------------------------------

export type UserSettingsRelations = {
  User: UserWithRelations;
};

export type UserSettingsWithRelations = z.infer<typeof UserSettingsSchema> & UserSettingsRelations

export const UserSettingsWithRelationsSchema: z.ZodType<UserSettingsWithRelations> = UserSettingsSchema.merge(z.object({
  User: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// CLIENT SALES REP COMPANY SCHEMA
/////////////////////////////////////////

export const ClientSalesRepCompanySchema = z.object({
  clientId: z.string(),
  salesRepUsername: z.string(),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' }),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date().nullish(),
  isActive: z.boolean(),
})

export type ClientSalesRepCompany = z.infer<typeof ClientSalesRepCompanySchema>

// CLIENT SALES REP COMPANY OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ClientSalesRepCompanyOptionalDefaultsSchema = ClientSalesRepCompanySchema.merge(z.object({
  fromDate: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
}))

export type ClientSalesRepCompanyOptionalDefaults = z.infer<typeof ClientSalesRepCompanyOptionalDefaultsSchema>

// CLIENT SALES REP COMPANY RELATION SCHEMA
//------------------------------------------------------

export type ClientSalesRepCompanyRelations = {
  client: ClientWithRelations;
  salesRep: SalesRepWithRelations;
  company: CompanyWithRelations;
};

export type ClientSalesRepCompanyWithRelations = z.infer<typeof ClientSalesRepCompanySchema> & ClientSalesRepCompanyRelations

export const ClientSalesRepCompanyWithRelationsSchema: z.ZodType<ClientSalesRepCompanyWithRelations> = ClientSalesRepCompanySchema.merge(z.object({
  client: z.lazy(() => ClientWithRelationsSchema),
  salesRep: z.lazy(() => SalesRepWithRelationsSchema),
  company: z.lazy(() => CompanyWithRelationsSchema),
}))

// CLIENT SALES REP COMPANY OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ClientSalesRepCompanyOptionalDefaultsWithRelations = z.infer<typeof ClientSalesRepCompanyOptionalDefaultsSchema> & ClientSalesRepCompanyRelations

export const ClientSalesRepCompanyOptionalDefaultsWithRelationsSchema: z.ZodType<ClientSalesRepCompanyOptionalDefaultsWithRelations> = ClientSalesRepCompanyOptionalDefaultsSchema.merge(z.object({
  client: z.lazy(() => ClientWithRelationsSchema),
  salesRep: z.lazy(() => SalesRepWithRelationsSchema),
  company: z.lazy(() => CompanyWithRelationsSchema),
}))

/////////////////////////////////////////
// CLIENT ADDRESS SCHEMA
/////////////////////////////////////////

export const ClientAddressSchema = z.object({
  clientId: z.string(),
  address: z.string().min(1).max(100),
  state: z.string().min(2).max(2).refine((v) => validator.isAlpha(v), { message: 'Invalid state' }),
  city: z.string().min(1).max(100),
  country: z.string().min(2).max(3).refine((v) => validator.isAlpha(v), { message: 'Invalid country code' }),
  zip: z.string().refine((v) => validator.isPostalCode(v, 'US'), { message: 'Invalid zip' }),
  updatedAt: z.coerce.date(),
})

export type ClientAddress = z.infer<typeof ClientAddressSchema>

// CLIENT ADDRESS OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ClientAddressOptionalDefaultsSchema = ClientAddressSchema.merge(z.object({
  updatedAt: z.coerce.date().optional(),
}))

export type ClientAddressOptionalDefaults = z.infer<typeof ClientAddressOptionalDefaultsSchema>

// CLIENT ADDRESS RELATION SCHEMA
//------------------------------------------------------

export type ClientAddressRelations = {
  Client?: ClientWithRelations | null;
};

export type ClientAddressWithRelations = z.infer<typeof ClientAddressSchema> & ClientAddressRelations

export const ClientAddressWithRelationsSchema: z.ZodType<ClientAddressWithRelations> = ClientAddressSchema.merge(z.object({
  Client: z.lazy(() => ClientWithRelationsSchema).nullish(),
}))

// CLIENT ADDRESS OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ClientAddressOptionalDefaultsWithRelations = z.infer<typeof ClientAddressOptionalDefaultsSchema> & ClientAddressRelations

export const ClientAddressOptionalDefaultsWithRelationsSchema: z.ZodType<ClientAddressOptionalDefaultsWithRelations> = ClientAddressOptionalDefaultsSchema.merge(z.object({
  Client: z.lazy(() => ClientWithRelationsSchema).nullish(),
}))

/////////////////////////////////////////
// CLIENT EMAIL SCHEMA
/////////////////////////////////////////

export const ClientEmailSchema = z.object({
  type: EmailTypeSchema,
  email: z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),
  clientId: z.string(),
  description: z.string().nullish(),
  updatedAt: z.coerce.date(),
})

export type ClientEmail = z.infer<typeof ClientEmailSchema>

// CLIENT EMAIL OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ClientEmailOptionalDefaultsSchema = ClientEmailSchema.merge(z.object({
  updatedAt: z.coerce.date().optional(),
}))

export type ClientEmailOptionalDefaults = z.infer<typeof ClientEmailOptionalDefaultsSchema>

// CLIENT EMAIL RELATION SCHEMA
//------------------------------------------------------

export type ClientEmailRelations = {
  client: ClientWithRelations;
};

export type ClientEmailWithRelations = z.infer<typeof ClientEmailSchema> & ClientEmailRelations

export const ClientEmailWithRelationsSchema: z.ZodType<ClientEmailWithRelations> = ClientEmailSchema.merge(z.object({
  client: z.lazy(() => ClientWithRelationsSchema),
}))

// CLIENT EMAIL OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ClientEmailOptionalDefaultsWithRelations = z.infer<typeof ClientEmailOptionalDefaultsSchema> & ClientEmailRelations

export const ClientEmailOptionalDefaultsWithRelationsSchema: z.ZodType<ClientEmailOptionalDefaultsWithRelations> = ClientEmailOptionalDefaultsSchema.merge(z.object({
  client: z.lazy(() => ClientWithRelationsSchema),
}))

/////////////////////////////////////////
// CLIENT PHONE SCHEMA
/////////////////////////////////////////

export const ClientPhoneSchema = z.object({
  type: PhoneTypeSchema,
  phone: z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),
  clientId: z.string(),
  description: z.string().nullish(),
  updatedAt: z.coerce.date(),
})

export type ClientPhone = z.infer<typeof ClientPhoneSchema>

// CLIENT PHONE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ClientPhoneOptionalDefaultsSchema = ClientPhoneSchema.merge(z.object({
  updatedAt: z.coerce.date().optional(),
}))

export type ClientPhoneOptionalDefaults = z.infer<typeof ClientPhoneOptionalDefaultsSchema>

// CLIENT PHONE RELATION SCHEMA
//------------------------------------------------------

export type ClientPhoneRelations = {
  client: ClientWithRelations;
};

export type ClientPhoneWithRelations = z.infer<typeof ClientPhoneSchema> & ClientPhoneRelations

export const ClientPhoneWithRelationsSchema: z.ZodType<ClientPhoneWithRelations> = ClientPhoneSchema.merge(z.object({
  client: z.lazy(() => ClientWithRelationsSchema),
}))

// CLIENT PHONE OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ClientPhoneOptionalDefaultsWithRelations = z.infer<typeof ClientPhoneOptionalDefaultsSchema> & ClientPhoneRelations

export const ClientPhoneOptionalDefaultsWithRelationsSchema: z.ZodType<ClientPhoneOptionalDefaultsWithRelations> = ClientPhoneOptionalDefaultsSchema.merge(z.object({
  client: z.lazy(() => ClientWithRelationsSchema),
}))

/////////////////////////////////////////
// COMPANY SCHEMA
/////////////////////////////////////////

export const CompanySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
})

export type Company = z.infer<typeof CompanySchema>

// COMPANY OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CompanyOptionalDefaultsSchema = CompanySchema.merge(z.object({
  id: z.number().int().optional(),
}))

export type CompanyOptionalDefaults = z.infer<typeof CompanyOptionalDefaultsSchema>

// COMPANY RELATION SCHEMA
//------------------------------------------------------

export type CompanyRelations = {
  SalesRep: SalesRepWithRelations[];
  ClientSalesRepCompany: ClientSalesRepCompanyWithRelations[];
  Client: ClientWithRelations[];
};

export type CompanyWithRelations = z.infer<typeof CompanySchema> & CompanyRelations

export const CompanyWithRelationsSchema: z.ZodType<CompanyWithRelations> = CompanySchema.merge(z.object({
  SalesRep: z.lazy(() => SalesRepWithRelationsSchema).array(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyWithRelationsSchema).array(),
  Client: z.lazy(() => ClientWithRelationsSchema).array(),
}))

// COMPANY OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type CompanyOptionalDefaultsWithRelations = z.infer<typeof CompanyOptionalDefaultsSchema> & CompanyRelations

export const CompanyOptionalDefaultsWithRelationsSchema: z.ZodType<CompanyOptionalDefaultsWithRelations> = CompanyOptionalDefaultsSchema.merge(z.object({
  SalesRep: z.lazy(() => SalesRepWithRelationsSchema).array(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyWithRelationsSchema).array(),
  Client: z.lazy(() => ClientWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserRolesSchema,
  id: z.string(),
  username: z.string(),
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  session: SessionWithRelations[];
  Key: KeyWithRelations[];
  SalesRep?: SalesRepWithRelations | null;
  UserSettings: UserSettingsWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  session: z.lazy(() => SessionWithRelationsSchema).array(),
  Key: z.lazy(() => KeyWithRelationsSchema).array(),
  SalesRep: z.lazy(() => SalesRepWithRelationsSchema).nullish(),
  UserSettings: z.lazy(() => UserSettingsWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  active_expires: z.bigint(),
  idle_expires: z.bigint(),
})

export type Session = z.infer<typeof SessionSchema>

// SESSION RELATION SCHEMA
//------------------------------------------------------

export type SessionRelations = {
  user: UserWithRelations;
};

export type SessionWithRelations = z.infer<typeof SessionSchema> & SessionRelations

export const SessionWithRelationsSchema: z.ZodType<SessionWithRelations> = SessionSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// KEY SCHEMA
/////////////////////////////////////////

export const KeySchema = z.object({
  id: z.string(),
  hashed_password: z.string().nullish(),
  user_id: z.string(),
  primary: z.boolean(),
  expires: z.bigint().nullish(),
})

export type Key = z.infer<typeof KeySchema>

// KEY RELATION SCHEMA
//------------------------------------------------------

export type KeyRelations = {
  user: UserWithRelations;
};

export type KeyWithRelations = z.infer<typeof KeySchema> & KeyRelations

export const KeyWithRelationsSchema: z.ZodType<KeyWithRelations> = KeySchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// CLIENT
//------------------------------------------------------

export const ClientIncludeSchema: z.ZodType<Prisma.ClientInclude> = z.object({
  emails: z.union([z.boolean(),z.lazy(() => ClientEmailFindManyArgsSchema)]).optional(),
  phones: z.union([z.boolean(),z.lazy(() => ClientPhoneFindManyArgsSchema)]).optional(),
  orders: z.union([z.boolean(),z.lazy(() => PurchaseOrderFindManyArgsSchema)]).optional(),
  clientSalesRepCompany: z.union([z.boolean(),z.lazy(() => ClientSalesRepCompanyFindManyArgsSchema)]).optional(),
  salesRep: z.union([z.boolean(),z.lazy(() => SalesRepArgsSchema)]).optional(),
  company: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
  clientAddress: z.union([z.boolean(),z.lazy(() => ClientAddressArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ClientCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ClientArgsSchema: z.ZodType<Prisma.ClientArgs> = z.object({
  select: z.lazy(() => ClientSelectSchema).optional(),
  include: z.lazy(() => ClientIncludeSchema).optional(),
}).strict();

export const ClientCountOutputTypeArgsSchema: z.ZodType<Prisma.ClientCountOutputTypeArgs> = z.object({
  select: z.lazy(() => ClientCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ClientCountOutputTypeSelectSchema: z.ZodType<Prisma.ClientCountOutputTypeSelect> = z.object({
  emails: z.boolean().optional(),
  phones: z.boolean().optional(),
  orders: z.boolean().optional(),
  clientSalesRepCompany: z.boolean().optional(),
}).strict();

export const ClientSelectSchema: z.ZodType<Prisma.ClientSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  companyName: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  addTransactionCharges: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  payMethod: z.boolean().optional(),
  currency: z.boolean().optional(),
  status: z.boolean().optional(),
  notes: z.boolean().optional(),
  salesRepUsername: z.boolean().optional(),
  companyId: z.boolean().optional(),
  emails: z.union([z.boolean(),z.lazy(() => ClientEmailFindManyArgsSchema)]).optional(),
  phones: z.union([z.boolean(),z.lazy(() => ClientPhoneFindManyArgsSchema)]).optional(),
  orders: z.union([z.boolean(),z.lazy(() => PurchaseOrderFindManyArgsSchema)]).optional(),
  clientSalesRepCompany: z.union([z.boolean(),z.lazy(() => ClientSalesRepCompanyFindManyArgsSchema)]).optional(),
  salesRep: z.union([z.boolean(),z.lazy(() => SalesRepArgsSchema)]).optional(),
  company: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
  clientAddress: z.union([z.boolean(),z.lazy(() => ClientAddressArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ClientCountOutputTypeArgsSchema)]).optional(),
}).strict()

// VENDOR
//------------------------------------------------------

export const VendorIncludeSchema: z.ZodType<Prisma.VendorInclude> = z.object({
  orders: z.union([z.boolean(),z.lazy(() => JobFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => VendorCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const VendorArgsSchema: z.ZodType<Prisma.VendorArgs> = z.object({
  select: z.lazy(() => VendorSelectSchema).optional(),
  include: z.lazy(() => VendorIncludeSchema).optional(),
}).strict();

export const VendorCountOutputTypeArgsSchema: z.ZodType<Prisma.VendorCountOutputTypeArgs> = z.object({
  select: z.lazy(() => VendorCountOutputTypeSelectSchema).nullish(),
}).strict();

export const VendorCountOutputTypeSelectSchema: z.ZodType<Prisma.VendorCountOutputTypeSelect> = z.object({
  orders: z.boolean().optional(),
}).strict();

export const VendorSelectSchema: z.ZodType<Prisma.VendorSelect> = z.object({
  id: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  department: z.boolean().optional(),
  status: z.boolean().optional(),
  orders: z.union([z.boolean(),z.lazy(() => JobFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => VendorCountOutputTypeArgsSchema)]).optional(),
}).strict()

// GMAIL MSG
//------------------------------------------------------

export const GmailMsgIncludeSchema: z.ZodType<Prisma.GmailMsgInclude> = z.object({
  job: z.union([z.boolean(),z.lazy(() => JobArgsSchema)]).optional(),
}).strict()

export const GmailMsgArgsSchema: z.ZodType<Prisma.GmailMsgArgs> = z.object({
  select: z.lazy(() => GmailMsgSelectSchema).optional(),
  include: z.lazy(() => GmailMsgIncludeSchema).optional(),
}).strict();

export const GmailMsgSelectSchema: z.ZodType<Prisma.GmailMsgSelect> = z.object({
  threadId: z.boolean().optional(),
  inboxMsgId: z.boolean().optional(),
  jobId: z.boolean().optional(),
  direction: z.boolean().optional(),
  job: z.union([z.boolean(),z.lazy(() => JobArgsSchema)]).optional(),
}).strict()

// JOB
//------------------------------------------------------

export const JobIncludeSchema: z.ZodType<Prisma.JobInclude> = z.object({
  GmailMsgs: z.union([z.boolean(),z.lazy(() => GmailMsgFindManyArgsSchema)]).optional(),
  purchaseOrder: z.union([z.boolean(),z.lazy(() => PurchaseOrderArgsSchema)]).optional(),
  vendor: z.union([z.boolean(),z.lazy(() => VendorArgsSchema)]).optional(),
  PurchaseOrder: z.union([z.boolean(),z.lazy(() => PurchaseOrderArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => JobCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const JobArgsSchema: z.ZodType<Prisma.JobArgs> = z.object({
  select: z.lazy(() => JobSelectSchema).optional(),
  include: z.lazy(() => JobIncludeSchema).optional(),
}).strict();

export const JobCountOutputTypeArgsSchema: z.ZodType<Prisma.JobCountOutputTypeArgs> = z.object({
  select: z.lazy(() => JobCountOutputTypeSelectSchema).nullish(),
}).strict();

export const JobCountOutputTypeSelectSchema: z.ZodType<Prisma.JobCountOutputTypeSelect> = z.object({
  GmailMsgs: z.boolean().optional(),
}).strict();

export const JobSelectSchema: z.ZodType<Prisma.JobSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  price: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  type: z.boolean().optional(),
  status: z.boolean().optional(),
  vendorId: z.boolean().optional(),
  purchaseOrderId: z.boolean().optional(),
  GmailMsgs: z.union([z.boolean(),z.lazy(() => GmailMsgFindManyArgsSchema)]).optional(),
  purchaseOrder: z.union([z.boolean(),z.lazy(() => PurchaseOrderArgsSchema)]).optional(),
  vendor: z.union([z.boolean(),z.lazy(() => VendorArgsSchema)]).optional(),
  PurchaseOrder: z.union([z.boolean(),z.lazy(() => PurchaseOrderArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => JobCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PURCHASE ORDER
//------------------------------------------------------

export const PurchaseOrderIncludeSchema: z.ZodType<Prisma.PurchaseOrderInclude> = z.object({
  jobs: z.union([z.boolean(),z.lazy(() => JobFindManyArgsSchema)]).optional(),
  client: z.union([z.boolean(),z.lazy(() => ClientArgsSchema)]).optional(),
  primaryJob: z.union([z.boolean(),z.lazy(() => JobArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PurchaseOrderCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PurchaseOrderArgsSchema: z.ZodType<Prisma.PurchaseOrderArgs> = z.object({
  select: z.lazy(() => PurchaseOrderSelectSchema).optional(),
  include: z.lazy(() => PurchaseOrderIncludeSchema).optional(),
}).strict();

export const PurchaseOrderCountOutputTypeArgsSchema: z.ZodType<Prisma.PurchaseOrderCountOutputTypeArgs> = z.object({
  select: z.lazy(() => PurchaseOrderCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PurchaseOrderCountOutputTypeSelectSchema: z.ZodType<Prisma.PurchaseOrderCountOutputTypeSelect> = z.object({
  jobs: z.boolean().optional(),
}).strict();

export const PurchaseOrderSelectSchema: z.ZodType<Prisma.PurchaseOrderSelect> = z.object({
  id: z.boolean().optional(),
  clientId: z.boolean().optional(),
  primaryJobId: z.boolean().optional(),
  jobs: z.union([z.boolean(),z.lazy(() => JobFindManyArgsSchema)]).optional(),
  client: z.union([z.boolean(),z.lazy(() => ClientArgsSchema)]).optional(),
  primaryJob: z.union([z.boolean(),z.lazy(() => JobArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PurchaseOrderCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SALES REP
//------------------------------------------------------

export const SalesRepIncludeSchema: z.ZodType<Prisma.SalesRepInclude> = z.object({
  company: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  clientSalesRepCompany: z.union([z.boolean(),z.lazy(() => ClientSalesRepCompanyFindManyArgsSchema)]).optional(),
  client: z.union([z.boolean(),z.lazy(() => ClientFindManyArgsSchema)]).optional(),
  SalesRepColors: z.union([z.boolean(),z.lazy(() => ColorSettingsFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SalesRepCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const SalesRepArgsSchema: z.ZodType<Prisma.SalesRepArgs> = z.object({
  select: z.lazy(() => SalesRepSelectSchema).optional(),
  include: z.lazy(() => SalesRepIncludeSchema).optional(),
}).strict();

export const SalesRepCountOutputTypeArgsSchema: z.ZodType<Prisma.SalesRepCountOutputTypeArgs> = z.object({
  select: z.lazy(() => SalesRepCountOutputTypeSelectSchema).nullish(),
}).strict();

export const SalesRepCountOutputTypeSelectSchema: z.ZodType<Prisma.SalesRepCountOutputTypeSelect> = z.object({
  clientSalesRepCompany: z.boolean().optional(),
  client: z.boolean().optional(),
  SalesRepColors: z.boolean().optional(),
}).strict();

export const SalesRepSelectSchema: z.ZodType<Prisma.SalesRepSelect> = z.object({
  id: z.boolean().optional(),
  username: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  companyId: z.boolean().optional(),
  company: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  clientSalesRepCompany: z.union([z.boolean(),z.lazy(() => ClientSalesRepCompanyFindManyArgsSchema)]).optional(),
  client: z.union([z.boolean(),z.lazy(() => ClientFindManyArgsSchema)]).optional(),
  SalesRepColors: z.union([z.boolean(),z.lazy(() => ColorSettingsFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SalesRepCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COLOR SETTINGS
//------------------------------------------------------

export const ColorSettingsIncludeSchema: z.ZodType<Prisma.ColorSettingsInclude> = z.object({
  salesRep: z.union([z.boolean(),z.lazy(() => SalesRepArgsSchema)]).optional(),
}).strict()

export const ColorSettingsArgsSchema: z.ZodType<Prisma.ColorSettingsArgs> = z.object({
  select: z.lazy(() => ColorSettingsSelectSchema).optional(),
  include: z.lazy(() => ColorSettingsIncludeSchema).optional(),
}).strict();

export const ColorSettingsSelectSchema: z.ZodType<Prisma.ColorSettingsSelect> = z.object({
  salesRepUsername: z.boolean().optional(),
  accentColor: z.boolean().optional(),
  primaryColor: z.boolean().optional(),
  secondaryColor: z.boolean().optional(),
  auxiliaryColor: z.boolean().optional(),
  theme: z.boolean().optional(),
  salesRep: z.union([z.boolean(),z.lazy(() => SalesRepArgsSchema)]).optional(),
}).strict()

// USER SETTINGS
//------------------------------------------------------

export const UserSettingsIncludeSchema: z.ZodType<Prisma.UserSettingsInclude> = z.object({
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const UserSettingsArgsSchema: z.ZodType<Prisma.UserSettingsArgs> = z.object({
  select: z.lazy(() => UserSettingsSelectSchema).optional(),
  include: z.lazy(() => UserSettingsIncludeSchema).optional(),
}).strict();

export const UserSettingsSelectSchema: z.ZodType<Prisma.UserSettingsSelect> = z.object({
  username: z.boolean().optional(),
  settings: z.boolean().optional(),
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// CLIENT SALES REP COMPANY
//------------------------------------------------------

export const ClientSalesRepCompanyIncludeSchema: z.ZodType<Prisma.ClientSalesRepCompanyInclude> = z.object({
  client: z.union([z.boolean(),z.lazy(() => ClientArgsSchema)]).optional(),
  salesRep: z.union([z.boolean(),z.lazy(() => SalesRepArgsSchema)]).optional(),
  company: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
}).strict()

export const ClientSalesRepCompanyArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyArgs> = z.object({
  select: z.lazy(() => ClientSalesRepCompanySelectSchema).optional(),
  include: z.lazy(() => ClientSalesRepCompanyIncludeSchema).optional(),
}).strict();

export const ClientSalesRepCompanySelectSchema: z.ZodType<Prisma.ClientSalesRepCompanySelect> = z.object({
  clientId: z.boolean().optional(),
  salesRepUsername: z.boolean().optional(),
  companyId: z.boolean().optional(),
  fromDate: z.boolean().optional(),
  toDate: z.boolean().optional(),
  isActive: z.boolean().optional(),
  client: z.union([z.boolean(),z.lazy(() => ClientArgsSchema)]).optional(),
  salesRep: z.union([z.boolean(),z.lazy(() => SalesRepArgsSchema)]).optional(),
  company: z.union([z.boolean(),z.lazy(() => CompanyArgsSchema)]).optional(),
}).strict()

// CLIENT ADDRESS
//------------------------------------------------------

export const ClientAddressIncludeSchema: z.ZodType<Prisma.ClientAddressInclude> = z.object({
  Client: z.union([z.boolean(),z.lazy(() => ClientArgsSchema)]).optional(),
}).strict()

export const ClientAddressArgsSchema: z.ZodType<Prisma.ClientAddressArgs> = z.object({
  select: z.lazy(() => ClientAddressSelectSchema).optional(),
  include: z.lazy(() => ClientAddressIncludeSchema).optional(),
}).strict();

export const ClientAddressSelectSchema: z.ZodType<Prisma.ClientAddressSelect> = z.object({
  clientId: z.boolean().optional(),
  address: z.boolean().optional(),
  state: z.boolean().optional(),
  city: z.boolean().optional(),
  country: z.boolean().optional(),
  zip: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  Client: z.union([z.boolean(),z.lazy(() => ClientArgsSchema)]).optional(),
}).strict()

// CLIENT EMAIL
//------------------------------------------------------

export const ClientEmailIncludeSchema: z.ZodType<Prisma.ClientEmailInclude> = z.object({
  client: z.union([z.boolean(),z.lazy(() => ClientArgsSchema)]).optional(),
}).strict()

export const ClientEmailArgsSchema: z.ZodType<Prisma.ClientEmailArgs> = z.object({
  select: z.lazy(() => ClientEmailSelectSchema).optional(),
  include: z.lazy(() => ClientEmailIncludeSchema).optional(),
}).strict();

export const ClientEmailSelectSchema: z.ZodType<Prisma.ClientEmailSelect> = z.object({
  email: z.boolean().optional(),
  clientId: z.boolean().optional(),
  description: z.boolean().optional(),
  type: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  client: z.union([z.boolean(),z.lazy(() => ClientArgsSchema)]).optional(),
}).strict()

// CLIENT PHONE
//------------------------------------------------------

export const ClientPhoneIncludeSchema: z.ZodType<Prisma.ClientPhoneInclude> = z.object({
  client: z.union([z.boolean(),z.lazy(() => ClientArgsSchema)]).optional(),
}).strict()

export const ClientPhoneArgsSchema: z.ZodType<Prisma.ClientPhoneArgs> = z.object({
  select: z.lazy(() => ClientPhoneSelectSchema).optional(),
  include: z.lazy(() => ClientPhoneIncludeSchema).optional(),
}).strict();

export const ClientPhoneSelectSchema: z.ZodType<Prisma.ClientPhoneSelect> = z.object({
  phone: z.boolean().optional(),
  clientId: z.boolean().optional(),
  description: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  type: z.boolean().optional(),
  client: z.union([z.boolean(),z.lazy(() => ClientArgsSchema)]).optional(),
}).strict()

// COMPANY
//------------------------------------------------------

export const CompanyIncludeSchema: z.ZodType<Prisma.CompanyInclude> = z.object({
  SalesRep: z.union([z.boolean(),z.lazy(() => SalesRepFindManyArgsSchema)]).optional(),
  ClientSalesRepCompany: z.union([z.boolean(),z.lazy(() => ClientSalesRepCompanyFindManyArgsSchema)]).optional(),
  Client: z.union([z.boolean(),z.lazy(() => ClientFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CompanyCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CompanyArgsSchema: z.ZodType<Prisma.CompanyArgs> = z.object({
  select: z.lazy(() => CompanySelectSchema).optional(),
  include: z.lazy(() => CompanyIncludeSchema).optional(),
}).strict();

export const CompanyCountOutputTypeArgsSchema: z.ZodType<Prisma.CompanyCountOutputTypeArgs> = z.object({
  select: z.lazy(() => CompanyCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CompanyCountOutputTypeSelectSchema: z.ZodType<Prisma.CompanyCountOutputTypeSelect> = z.object({
  SalesRep: z.boolean().optional(),
  ClientSalesRepCompany: z.boolean().optional(),
  Client: z.boolean().optional(),
}).strict();

export const CompanySelectSchema: z.ZodType<Prisma.CompanySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  address: z.boolean().optional(),
  city: z.boolean().optional(),
  state: z.boolean().optional(),
  country: z.boolean().optional(),
  zip: z.boolean().optional(),
  phone: z.boolean().optional(),
  email: z.boolean().optional(),
  website: z.boolean().optional(),
  SalesRep: z.union([z.boolean(),z.lazy(() => SalesRepFindManyArgsSchema)]).optional(),
  ClientSalesRepCompany: z.union([z.boolean(),z.lazy(() => ClientSalesRepCompanyFindManyArgsSchema)]).optional(),
  Client: z.union([z.boolean(),z.lazy(() => ClientFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CompanyCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  session: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  Key: z.union([z.boolean(),z.lazy(() => KeyFindManyArgsSchema)]).optional(),
  SalesRep: z.union([z.boolean(),z.lazy(() => SalesRepArgsSchema)]).optional(),
  UserSettings: z.union([z.boolean(),z.lazy(() => UserSettingsFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  session: z.boolean().optional(),
  Key: z.boolean().optional(),
  UserSettings: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  username: z.boolean().optional(),
  role: z.boolean().optional(),
  session: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  Key: z.union([z.boolean(),z.lazy(() => KeyFindManyArgsSchema)]).optional(),
  SalesRep: z.union([z.boolean(),z.lazy(() => SalesRepArgsSchema)]).optional(),
  UserSettings: z.union([z.boolean(),z.lazy(() => UserSettingsFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  user_id: z.boolean().optional(),
  active_expires: z.boolean().optional(),
  idle_expires: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// KEY
//------------------------------------------------------

export const KeyIncludeSchema: z.ZodType<Prisma.KeyInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const KeyArgsSchema: z.ZodType<Prisma.KeyArgs> = z.object({
  select: z.lazy(() => KeySelectSchema).optional(),
  include: z.lazy(() => KeyIncludeSchema).optional(),
}).strict();

export const KeySelectSchema: z.ZodType<Prisma.KeySelect> = z.object({
  id: z.boolean().optional(),
  hashed_password: z.boolean().optional(),
  user_id: z.boolean().optional(),
  primary: z.boolean().optional(),
  expires: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ClientWhereInputSchema: z.ZodType<Prisma.ClientWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClientWhereInputSchema),z.lazy(() => ClientWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientWhereInputSchema),z.lazy(() => ClientWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  companyName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  addTransactionCharges: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  payMethod: z.union([ z.lazy(() => EnumPayMethodFilterSchema),z.lazy(() => PayMethodSchema) ]).optional(),
  currency: z.union([ z.lazy(() => EnumCurrencyFilterSchema),z.lazy(() => CurrencySchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumClientStatusFilterSchema),z.lazy(() => ClientStatusSchema) ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  salesRepUsername: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  companyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  emails: z.lazy(() => ClientEmailListRelationFilterSchema).optional(),
  phones: z.lazy(() => ClientPhoneListRelationFilterSchema).optional(),
  orders: z.lazy(() => PurchaseOrderListRelationFilterSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyListRelationFilterSchema).optional(),
  salesRep: z.union([ z.lazy(() => SalesRepRelationFilterSchema),z.lazy(() => SalesRepWhereInputSchema) ]).optional(),
  company: z.union([ z.lazy(() => CompanyRelationFilterSchema),z.lazy(() => CompanyWhereInputSchema) ]).optional(),
  clientAddress: z.union([ z.lazy(() => ClientAddressRelationFilterSchema),z.lazy(() => ClientAddressWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ClientOrderByWithRelationInputSchema: z.ZodType<Prisma.ClientOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  companyName: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  addTransactionCharges: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  payMethod: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  emails: z.lazy(() => ClientEmailOrderByRelationAggregateInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneOrderByRelationAggregateInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderOrderByRelationAggregateInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyOrderByRelationAggregateInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepOrderByWithRelationInputSchema).optional(),
  company: z.lazy(() => CompanyOrderByWithRelationInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressOrderByWithRelationInputSchema).optional()
}).strict();

export const ClientWhereUniqueInputSchema: z.ZodType<Prisma.ClientWhereUniqueInput> = z.object({
  id: z.string().min(1).max(32).optional()
}).strict();

export const ClientOrderByWithAggregationInputSchema: z.ZodType<Prisma.ClientOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  companyName: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  addTransactionCharges: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  payMethod: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ClientCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ClientAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ClientMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ClientMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ClientSumOrderByAggregateInputSchema).optional()
}).strict();

export const ClientScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ClientScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ClientScalarWhereWithAggregatesInputSchema),z.lazy(() => ClientScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientScalarWhereWithAggregatesInputSchema),z.lazy(() => ClientScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  companyName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  addTransactionCharges: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  payMethod: z.union([ z.lazy(() => EnumPayMethodWithAggregatesFilterSchema),z.lazy(() => PayMethodSchema) ]).optional(),
  currency: z.union([ z.lazy(() => EnumCurrencyWithAggregatesFilterSchema),z.lazy(() => CurrencySchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumClientStatusWithAggregatesFilterSchema),z.lazy(() => ClientStatusSchema) ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  salesRepUsername: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  companyId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const VendorWhereInputSchema: z.ZodType<Prisma.VendorWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VendorWhereInputSchema),z.lazy(() => VendorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VendorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VendorWhereInputSchema),z.lazy(() => VendorWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  department: z.union([ z.lazy(() => EnumDepartmentFilterSchema),z.lazy(() => DepartmentSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumVendorStatusFilterSchema),z.lazy(() => VendorStatusSchema) ]).optional(),
  orders: z.lazy(() => JobListRelationFilterSchema).optional()
}).strict();

export const VendorOrderByWithRelationInputSchema: z.ZodType<Prisma.VendorOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  orders: z.lazy(() => JobOrderByRelationAggregateInputSchema).optional()
}).strict();

export const VendorWhereUniqueInputSchema: z.ZodType<Prisma.VendorWhereUniqueInput> = z.object({
  id: z.number().int().optional()
}).strict();

export const VendorOrderByWithAggregationInputSchema: z.ZodType<Prisma.VendorOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VendorCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => VendorAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VendorMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VendorMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => VendorSumOrderByAggregateInputSchema).optional()
}).strict();

export const VendorScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VendorScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => VendorScalarWhereWithAggregatesInputSchema),z.lazy(() => VendorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VendorScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VendorScalarWhereWithAggregatesInputSchema),z.lazy(() => VendorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  department: z.union([ z.lazy(() => EnumDepartmentWithAggregatesFilterSchema),z.lazy(() => DepartmentSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumVendorStatusWithAggregatesFilterSchema),z.lazy(() => VendorStatusSchema) ]).optional(),
}).strict();

export const GmailMsgWhereInputSchema: z.ZodType<Prisma.GmailMsgWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GmailMsgWhereInputSchema),z.lazy(() => GmailMsgWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GmailMsgWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GmailMsgWhereInputSchema),z.lazy(() => GmailMsgWhereInputSchema).array() ]).optional(),
  threadId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inboxMsgId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  jobId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  direction: z.union([ z.lazy(() => EnumEmailDirectionFilterSchema),z.lazy(() => EmailDirectionSchema) ]).optional(),
  job: z.union([ z.lazy(() => JobRelationFilterSchema),z.lazy(() => JobWhereInputSchema) ]).optional(),
}).strict();

export const GmailMsgOrderByWithRelationInputSchema: z.ZodType<Prisma.GmailMsgOrderByWithRelationInput> = z.object({
  threadId: z.lazy(() => SortOrderSchema).optional(),
  inboxMsgId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  direction: z.lazy(() => SortOrderSchema).optional(),
  job: z.lazy(() => JobOrderByWithRelationInputSchema).optional()
}).strict();

export const GmailMsgWhereUniqueInputSchema: z.ZodType<Prisma.GmailMsgWhereUniqueInput> = z.object({
  threadId_inboxMsgId_jobId: z.lazy(() => GmailMsgThreadIdInboxMsgIdJobIdCompoundUniqueInputSchema).optional()
}).strict();

export const GmailMsgOrderByWithAggregationInputSchema: z.ZodType<Prisma.GmailMsgOrderByWithAggregationInput> = z.object({
  threadId: z.lazy(() => SortOrderSchema).optional(),
  inboxMsgId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  direction: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => GmailMsgCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => GmailMsgMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => GmailMsgMinOrderByAggregateInputSchema).optional()
}).strict();

export const GmailMsgScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.GmailMsgScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => GmailMsgScalarWhereWithAggregatesInputSchema),z.lazy(() => GmailMsgScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => GmailMsgScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GmailMsgScalarWhereWithAggregatesInputSchema),z.lazy(() => GmailMsgScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  threadId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  inboxMsgId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  jobId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  direction: z.union([ z.lazy(() => EnumEmailDirectionWithAggregatesFilterSchema),z.lazy(() => EmailDirectionSchema) ]).optional(),
}).strict();

export const JobWhereInputSchema: z.ZodType<Prisma.JobWhereInput> = z.object({
  AND: z.union([ z.lazy(() => JobWhereInputSchema),z.lazy(() => JobWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => JobWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => JobWhereInputSchema),z.lazy(() => JobWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumJobTypeFilterSchema),z.lazy(() => JobTypeSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumJobStatusFilterSchema),z.lazy(() => JobStatusSchema) ]).optional(),
  vendorId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  purchaseOrderId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  GmailMsgs: z.lazy(() => GmailMsgListRelationFilterSchema).optional(),
  purchaseOrder: z.union([ z.lazy(() => PurchaseOrderRelationFilterSchema),z.lazy(() => PurchaseOrderWhereInputSchema) ]).optional(),
  vendor: z.union([ z.lazy(() => VendorRelationFilterSchema),z.lazy(() => VendorWhereInputSchema) ]).optional(),
  PurchaseOrder: z.union([ z.lazy(() => PurchaseOrderRelationFilterSchema),z.lazy(() => PurchaseOrderWhereInputSchema) ]).optional().nullable(),
}).strict();

export const JobOrderByWithRelationInputSchema: z.ZodType<Prisma.JobOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  purchaseOrderId: z.lazy(() => SortOrderSchema).optional(),
  GmailMsgs: z.lazy(() => GmailMsgOrderByRelationAggregateInputSchema).optional(),
  purchaseOrder: z.lazy(() => PurchaseOrderOrderByWithRelationInputSchema).optional(),
  vendor: z.lazy(() => VendorOrderByWithRelationInputSchema).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderOrderByWithRelationInputSchema).optional()
}).strict();

export const JobWhereUniqueInputSchema: z.ZodType<Prisma.JobWhereUniqueInput> = z.object({
  id: z.string().optional()
}).strict();

export const JobOrderByWithAggregationInputSchema: z.ZodType<Prisma.JobOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  purchaseOrderId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => JobCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => JobAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => JobMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => JobMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => JobSumOrderByAggregateInputSchema).optional()
}).strict();

export const JobScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.JobScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => JobScalarWhereWithAggregatesInputSchema),z.lazy(() => JobScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => JobScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => JobScalarWhereWithAggregatesInputSchema),z.lazy(() => JobScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumJobTypeWithAggregatesFilterSchema),z.lazy(() => JobTypeSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumJobStatusWithAggregatesFilterSchema),z.lazy(() => JobStatusSchema) ]).optional(),
  vendorId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  purchaseOrderId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const PurchaseOrderWhereInputSchema: z.ZodType<Prisma.PurchaseOrderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PurchaseOrderWhereInputSchema),z.lazy(() => PurchaseOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PurchaseOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PurchaseOrderWhereInputSchema),z.lazy(() => PurchaseOrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  primaryJobId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  jobs: z.lazy(() => JobListRelationFilterSchema).optional(),
  client: z.union([ z.lazy(() => ClientRelationFilterSchema),z.lazy(() => ClientWhereInputSchema) ]).optional(),
  primaryJob: z.union([ z.lazy(() => JobRelationFilterSchema),z.lazy(() => JobWhereInputSchema) ]).optional().nullable(),
}).strict();

export const PurchaseOrderOrderByWithRelationInputSchema: z.ZodType<Prisma.PurchaseOrderOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  primaryJobId: z.lazy(() => SortOrderSchema).optional(),
  jobs: z.lazy(() => JobOrderByRelationAggregateInputSchema).optional(),
  client: z.lazy(() => ClientOrderByWithRelationInputSchema).optional(),
  primaryJob: z.lazy(() => JobOrderByWithRelationInputSchema).optional()
}).strict();

export const PurchaseOrderWhereUniqueInputSchema: z.ZodType<Prisma.PurchaseOrderWhereUniqueInput> = z.object({
  id: z.number().int().optional(),
  primaryJobId: z.string().optional()
}).strict();

export const PurchaseOrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.PurchaseOrderOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  primaryJobId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PurchaseOrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PurchaseOrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PurchaseOrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PurchaseOrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PurchaseOrderSumOrderByAggregateInputSchema).optional()
}).strict();

export const PurchaseOrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PurchaseOrderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PurchaseOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => PurchaseOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PurchaseOrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PurchaseOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => PurchaseOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  clientId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  primaryJobId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const SalesRepWhereInputSchema: z.ZodType<Prisma.SalesRepWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SalesRepWhereInputSchema),z.lazy(() => SalesRepWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SalesRepWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SalesRepWhereInputSchema),z.lazy(() => SalesRepWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  companyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  company: z.union([ z.lazy(() => CompanyRelationFilterSchema),z.lazy(() => CompanyWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyListRelationFilterSchema).optional(),
  client: z.lazy(() => ClientListRelationFilterSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsListRelationFilterSchema).optional()
}).strict();

export const SalesRepOrderByWithRelationInputSchema: z.ZodType<Prisma.SalesRepOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  company: z.lazy(() => CompanyOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyOrderByRelationAggregateInputSchema).optional(),
  client: z.lazy(() => ClientOrderByRelationAggregateInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsOrderByRelationAggregateInputSchema).optional()
}).strict();

export const SalesRepWhereUniqueInputSchema: z.ZodType<Prisma.SalesRepWhereUniqueInput> = z.object({
  id: z.number().int().optional(),
  username: z.string().min(2).max(10).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }).optional()
}).strict();

export const SalesRepOrderByWithAggregationInputSchema: z.ZodType<Prisma.SalesRepOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SalesRepCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SalesRepAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SalesRepMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SalesRepMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SalesRepSumOrderByAggregateInputSchema).optional()
}).strict();

export const SalesRepScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SalesRepScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SalesRepScalarWhereWithAggregatesInputSchema),z.lazy(() => SalesRepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SalesRepScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SalesRepScalarWhereWithAggregatesInputSchema),z.lazy(() => SalesRepScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  companyId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const ColorSettingsWhereInputSchema: z.ZodType<Prisma.ColorSettingsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ColorSettingsWhereInputSchema),z.lazy(() => ColorSettingsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ColorSettingsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ColorSettingsWhereInputSchema),z.lazy(() => ColorSettingsWhereInputSchema).array() ]).optional(),
  salesRepUsername: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accentColor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  primaryColor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  secondaryColor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  auxiliaryColor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  theme: z.union([ z.lazy(() => EnumThemeFilterSchema),z.lazy(() => ThemeSchema) ]).optional(),
  salesRep: z.union([ z.lazy(() => SalesRepRelationFilterSchema),z.lazy(() => SalesRepWhereInputSchema) ]).optional(),
}).strict();

export const ColorSettingsOrderByWithRelationInputSchema: z.ZodType<Prisma.ColorSettingsOrderByWithRelationInput> = z.object({
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  accentColor: z.lazy(() => SortOrderSchema).optional(),
  primaryColor: z.lazy(() => SortOrderSchema).optional(),
  secondaryColor: z.lazy(() => SortOrderSchema).optional(),
  auxiliaryColor: z.lazy(() => SortOrderSchema).optional(),
  theme: z.lazy(() => SortOrderSchema).optional(),
  salesRep: z.lazy(() => SalesRepOrderByWithRelationInputSchema).optional()
}).strict();

export const ColorSettingsWhereUniqueInputSchema: z.ZodType<Prisma.ColorSettingsWhereUniqueInput> = z.object({
  salesRepUsername: z.string().min(2).max(2).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }).optional()
}).strict();

export const ColorSettingsOrderByWithAggregationInputSchema: z.ZodType<Prisma.ColorSettingsOrderByWithAggregationInput> = z.object({
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  accentColor: z.lazy(() => SortOrderSchema).optional(),
  primaryColor: z.lazy(() => SortOrderSchema).optional(),
  secondaryColor: z.lazy(() => SortOrderSchema).optional(),
  auxiliaryColor: z.lazy(() => SortOrderSchema).optional(),
  theme: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ColorSettingsCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ColorSettingsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ColorSettingsMinOrderByAggregateInputSchema).optional()
}).strict();

export const ColorSettingsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ColorSettingsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ColorSettingsScalarWhereWithAggregatesInputSchema),z.lazy(() => ColorSettingsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ColorSettingsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ColorSettingsScalarWhereWithAggregatesInputSchema),z.lazy(() => ColorSettingsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  salesRepUsername: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  accentColor: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  primaryColor: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  secondaryColor: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  auxiliaryColor: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  theme: z.union([ z.lazy(() => EnumThemeWithAggregatesFilterSchema),z.lazy(() => ThemeSchema) ]).optional(),
}).strict();

export const UserSettingsWhereInputSchema: z.ZodType<Prisma.UserSettingsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserSettingsWhereInputSchema),z.lazy(() => UserSettingsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserSettingsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserSettingsWhereInputSchema),z.lazy(() => UserSettingsWhereInputSchema).array() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  settings: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  User: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const UserSettingsOrderByWithRelationInputSchema: z.ZodType<Prisma.UserSettingsOrderByWithRelationInput> = z.object({
  username: z.lazy(() => SortOrderSchema).optional(),
  settings: z.lazy(() => SortOrderSchema).optional(),
  User: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const UserSettingsWhereUniqueInputSchema: z.ZodType<Prisma.UserSettingsWhereUniqueInput> = z.object({
  username: z.string().optional()
}).strict();

export const UserSettingsOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserSettingsOrderByWithAggregationInput> = z.object({
  username: z.lazy(() => SortOrderSchema).optional(),
  settings: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserSettingsCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserSettingsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserSettingsMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserSettingsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserSettingsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserSettingsScalarWhereWithAggregatesInputSchema),z.lazy(() => UserSettingsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserSettingsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserSettingsScalarWhereWithAggregatesInputSchema),z.lazy(() => UserSettingsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  username: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  settings: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ClientSalesRepCompanyWhereInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClientSalesRepCompanyWhereInputSchema),z.lazy(() => ClientSalesRepCompanyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientSalesRepCompanyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientSalesRepCompanyWhereInputSchema),z.lazy(() => ClientSalesRepCompanyWhereInputSchema).array() ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  salesRepUsername: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  companyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  fromDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  toDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  client: z.union([ z.lazy(() => ClientRelationFilterSchema),z.lazy(() => ClientWhereInputSchema) ]).optional(),
  salesRep: z.union([ z.lazy(() => SalesRepRelationFilterSchema),z.lazy(() => SalesRepWhereInputSchema) ]).optional(),
  company: z.union([ z.lazy(() => CompanyRelationFilterSchema),z.lazy(() => CompanyWhereInputSchema) ]).optional(),
}).strict();

export const ClientSalesRepCompanyOrderByWithRelationInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyOrderByWithRelationInput> = z.object({
  clientId: z.lazy(() => SortOrderSchema).optional(),
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  fromDate: z.lazy(() => SortOrderSchema).optional(),
  toDate: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  client: z.lazy(() => ClientOrderByWithRelationInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepOrderByWithRelationInputSchema).optional(),
  company: z.lazy(() => CompanyOrderByWithRelationInputSchema).optional()
}).strict();

export const ClientSalesRepCompanyWhereUniqueInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyWhereUniqueInput> = z.object({
  clientId_salesRepUsername: z.lazy(() => ClientSalesRepCompanyClientIdSalesRepUsernameCompoundUniqueInputSchema).optional()
}).strict();

export const ClientSalesRepCompanyOrderByWithAggregationInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyOrderByWithAggregationInput> = z.object({
  clientId: z.lazy(() => SortOrderSchema).optional(),
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  fromDate: z.lazy(() => SortOrderSchema).optional(),
  toDate: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ClientSalesRepCompanyCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ClientSalesRepCompanyAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ClientSalesRepCompanyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ClientSalesRepCompanyMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ClientSalesRepCompanySumOrderByAggregateInputSchema).optional()
}).strict();

export const ClientSalesRepCompanyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ClientSalesRepCompanyScalarWhereWithAggregatesInputSchema),z.lazy(() => ClientSalesRepCompanyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientSalesRepCompanyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientSalesRepCompanyScalarWhereWithAggregatesInputSchema),z.lazy(() => ClientSalesRepCompanyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  clientId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  salesRepUsername: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  companyId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  fromDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  toDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  isActive: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const ClientAddressWhereInputSchema: z.ZodType<Prisma.ClientAddressWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClientAddressWhereInputSchema),z.lazy(() => ClientAddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientAddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientAddressWhereInputSchema),z.lazy(() => ClientAddressWhereInputSchema).array() ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  zip: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Client: z.union([ z.lazy(() => ClientRelationFilterSchema),z.lazy(() => ClientWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ClientAddressOrderByWithRelationInputSchema: z.ZodType<Prisma.ClientAddressOrderByWithRelationInput> = z.object({
  clientId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zip: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  Client: z.lazy(() => ClientOrderByWithRelationInputSchema).optional()
}).strict();

export const ClientAddressWhereUniqueInputSchema: z.ZodType<Prisma.ClientAddressWhereUniqueInput> = z.object({
  clientId: z.string().optional()
}).strict();

export const ClientAddressOrderByWithAggregationInputSchema: z.ZodType<Prisma.ClientAddressOrderByWithAggregationInput> = z.object({
  clientId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zip: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ClientAddressCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ClientAddressMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ClientAddressMinOrderByAggregateInputSchema).optional()
}).strict();

export const ClientAddressScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ClientAddressScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ClientAddressScalarWhereWithAggregatesInputSchema),z.lazy(() => ClientAddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientAddressScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientAddressScalarWhereWithAggregatesInputSchema),z.lazy(() => ClientAddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  clientId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  zip: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ClientEmailWhereInputSchema: z.ZodType<Prisma.ClientEmailWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClientEmailWhereInputSchema),z.lazy(() => ClientEmailWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientEmailWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientEmailWhereInputSchema),z.lazy(() => ClientEmailWhereInputSchema).array() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumEmailTypeFilterSchema),z.lazy(() => EmailTypeSchema) ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  client: z.union([ z.lazy(() => ClientRelationFilterSchema),z.lazy(() => ClientWhereInputSchema) ]).optional(),
}).strict();

export const ClientEmailOrderByWithRelationInputSchema: z.ZodType<Prisma.ClientEmailOrderByWithRelationInput> = z.object({
  email: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  client: z.lazy(() => ClientOrderByWithRelationInputSchema).optional()
}).strict();

export const ClientEmailWhereUniqueInputSchema: z.ZodType<Prisma.ClientEmailWhereUniqueInput> = z.object({
  email_clientId: z.lazy(() => ClientEmailEmailClientIdCompoundUniqueInputSchema).optional()
}).strict();

export const ClientEmailOrderByWithAggregationInputSchema: z.ZodType<Prisma.ClientEmailOrderByWithAggregationInput> = z.object({
  email: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ClientEmailCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ClientEmailMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ClientEmailMinOrderByAggregateInputSchema).optional()
}).strict();

export const ClientEmailScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ClientEmailScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ClientEmailScalarWhereWithAggregatesInputSchema),z.lazy(() => ClientEmailScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientEmailScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientEmailScalarWhereWithAggregatesInputSchema),z.lazy(() => ClientEmailScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  clientId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumEmailTypeWithAggregatesFilterSchema),z.lazy(() => EmailTypeSchema) ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ClientPhoneWhereInputSchema: z.ZodType<Prisma.ClientPhoneWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClientPhoneWhereInputSchema),z.lazy(() => ClientPhoneWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientPhoneWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientPhoneWhereInputSchema),z.lazy(() => ClientPhoneWhereInputSchema).array() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumPhoneTypeFilterSchema),z.lazy(() => PhoneTypeSchema) ]).optional(),
  client: z.union([ z.lazy(() => ClientRelationFilterSchema),z.lazy(() => ClientWhereInputSchema) ]).optional(),
}).strict();

export const ClientPhoneOrderByWithRelationInputSchema: z.ZodType<Prisma.ClientPhoneOrderByWithRelationInput> = z.object({
  phone: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  client: z.lazy(() => ClientOrderByWithRelationInputSchema).optional()
}).strict();

export const ClientPhoneWhereUniqueInputSchema: z.ZodType<Prisma.ClientPhoneWhereUniqueInput> = z.object({
  phone_clientId: z.lazy(() => ClientPhonePhoneClientIdCompoundUniqueInputSchema).optional()
}).strict();

export const ClientPhoneOrderByWithAggregationInputSchema: z.ZodType<Prisma.ClientPhoneOrderByWithAggregationInput> = z.object({
  phone: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ClientPhoneCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ClientPhoneMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ClientPhoneMinOrderByAggregateInputSchema).optional()
}).strict();

export const ClientPhoneScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ClientPhoneScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ClientPhoneScalarWhereWithAggregatesInputSchema),z.lazy(() => ClientPhoneScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientPhoneScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientPhoneScalarWhereWithAggregatesInputSchema),z.lazy(() => ClientPhoneScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  phone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  clientId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumPhoneTypeWithAggregatesFilterSchema),z.lazy(() => PhoneTypeSchema) ]).optional(),
}).strict();

export const CompanyWhereInputSchema: z.ZodType<Prisma.CompanyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CompanyWhereInputSchema),z.lazy(() => CompanyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompanyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompanyWhereInputSchema),z.lazy(() => CompanyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  zip: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  website: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  SalesRep: z.lazy(() => SalesRepListRelationFilterSchema).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyListRelationFilterSchema).optional(),
  Client: z.lazy(() => ClientListRelationFilterSchema).optional()
}).strict();

export const CompanyOrderByWithRelationInputSchema: z.ZodType<Prisma.CompanyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zip: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional(),
  SalesRep: z.lazy(() => SalesRepOrderByRelationAggregateInputSchema).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyOrderByRelationAggregateInputSchema).optional(),
  Client: z.lazy(() => ClientOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CompanyWhereUniqueInputSchema: z.ZodType<Prisma.CompanyWhereUniqueInput> = z.object({
  id: z.number().int().optional()
}).strict();

export const CompanyOrderByWithAggregationInputSchema: z.ZodType<Prisma.CompanyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zip: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CompanyCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CompanyAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CompanyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CompanyMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CompanySumOrderByAggregateInputSchema).optional()
}).strict();

export const CompanyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CompanyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CompanyScalarWhereWithAggregatesInputSchema),z.lazy(() => CompanyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompanyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompanyScalarWhereWithAggregatesInputSchema),z.lazy(() => CompanyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  city: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  zip: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  website: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRolesFilterSchema),z.lazy(() => UserRolesSchema) ]).optional(),
  session: z.lazy(() => SessionListRelationFilterSchema).optional(),
  Key: z.lazy(() => KeyListRelationFilterSchema).optional(),
  SalesRep: z.union([ z.lazy(() => SalesRepRelationFilterSchema),z.lazy(() => SalesRepWhereInputSchema) ]).optional().nullable(),
  UserSettings: z.lazy(() => UserSettingsListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  session: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  Key: z.lazy(() => KeyOrderByRelationAggregateInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepOrderByWithRelationInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.object({
  id: z.string().optional(),
  username: z.string().optional()
}).strict();

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRolesWithAggregatesFilterSchema),z.lazy(() => UserRolesSchema) ]).optional(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active_expires: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  idle_expires: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  active_expires: z.lazy(() => SortOrderSchema).optional(),
  idle_expires: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.object({
  id: z.string().optional()
}).strict();

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  active_expires: z.lazy(() => SortOrderSchema).optional(),
  idle_expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SessionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SessionSumOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  user_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  active_expires: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  idle_expires: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
}).strict();

export const KeyWhereInputSchema: z.ZodType<Prisma.KeyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => KeyWhereInputSchema),z.lazy(() => KeyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => KeyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KeyWhereInputSchema),z.lazy(() => KeyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hashed_password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  primary: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  expires: z.union([ z.lazy(() => BigIntNullableFilterSchema),z.bigint() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const KeyOrderByWithRelationInputSchema: z.ZodType<Prisma.KeyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hashed_password: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  primary: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const KeyWhereUniqueInputSchema: z.ZodType<Prisma.KeyWhereUniqueInput> = z.object({
  id: z.string().optional()
}).strict();

export const KeyOrderByWithAggregationInputSchema: z.ZodType<Prisma.KeyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hashed_password: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  primary: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => KeyCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => KeyAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => KeyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => KeyMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => KeySumOrderByAggregateInputSchema).optional()
}).strict();

export const KeyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.KeyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => KeyScalarWhereWithAggregatesInputSchema),z.lazy(() => KeyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => KeyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KeyScalarWhereWithAggregatesInputSchema),z.lazy(() => KeyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  hashed_password: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  user_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  primary: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  expires: z.union([ z.lazy(() => BigIntNullableWithAggregatesFilterSchema),z.bigint() ]).optional().nullable(),
}).strict();

export const ClientCreateInputSchema: z.ZodType<Prisma.ClientCreateInput> = z.object({
  id: z.string().min(1).max(32),
  name: z.string().min(1).max(60),
  companyName: z.string().min(1).max(100),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  emails: z.lazy(() => ClientEmailCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutClientInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepCreateNestedOneWithoutClientInputSchema),
  company: z.lazy(() => CompanyCreateNestedOneWithoutClientInputSchema),
  clientAddress: z.lazy(() => ClientAddressCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientUncheckedCreateInputSchema: z.ZodType<Prisma.ClientUncheckedCreateInput> = z.object({
  id: z.string().min(1).max(32),
  name: z.string().min(1).max(60),
  companyName: z.string().min(1).max(100),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  salesRepUsername: z.string().min(2).max(20).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' }),
  emails: z.lazy(() => ClientEmailUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientUpdateInputSchema: z.ZodType<Prisma.ClientUpdateInput> = z.object({
  id: z.union([ z.string().min(1).max(32),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1).max(60),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emails: z.lazy(() => ClientEmailUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutClientNestedInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientUncheckedUpdateInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().min(1).max(32),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1).max(60),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRepUsername: z.union([ z.string().min(2).max(20).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.coerce.number().gte(1, { message: 'Please select a valid company' }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  emails: z.lazy(() => ClientEmailUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientCreateManyInputSchema: z.ZodType<Prisma.ClientCreateManyInput> = z.object({
  id: z.string().min(1).max(32),
  name: z.string().min(1).max(60),
  companyName: z.string().min(1).max(100),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  salesRepUsername: z.string().min(2).max(20).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' })
}).strict();

export const ClientUpdateManyMutationInputSchema: z.ZodType<Prisma.ClientUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().min(1).max(32),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1).max(60),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClientUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().min(1).max(32),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1).max(60),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRepUsername: z.union([ z.string().min(2).max(20).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.coerce.number().gte(1, { message: 'Please select a valid company' }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VendorCreateInputSchema: z.ZodType<Prisma.VendorCreateInput> = z.object({
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string(),
  name: z.string(),
  department: z.lazy(() => DepartmentSchema),
  status: z.lazy(() => VendorStatusSchema),
  orders: z.lazy(() => JobCreateNestedManyWithoutVendorInputSchema).optional()
}).strict();

export const VendorUncheckedCreateInputSchema: z.ZodType<Prisma.VendorUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string(),
  name: z.string(),
  department: z.lazy(() => DepartmentSchema),
  status: z.lazy(() => VendorStatusSchema),
  orders: z.lazy(() => JobUncheckedCreateNestedManyWithoutVendorInputSchema).optional()
}).strict();

export const VendorUpdateInputSchema: z.ZodType<Prisma.VendorUpdateInput> = z.object({
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.lazy(() => DepartmentSchema),z.lazy(() => EnumDepartmentFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => VendorStatusSchema),z.lazy(() => EnumVendorStatusFieldUpdateOperationsInputSchema) ]).optional(),
  orders: z.lazy(() => JobUpdateManyWithoutVendorNestedInputSchema).optional()
}).strict();

export const VendorUncheckedUpdateInputSchema: z.ZodType<Prisma.VendorUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.lazy(() => DepartmentSchema),z.lazy(() => EnumDepartmentFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => VendorStatusSchema),z.lazy(() => EnumVendorStatusFieldUpdateOperationsInputSchema) ]).optional(),
  orders: z.lazy(() => JobUncheckedUpdateManyWithoutVendorNestedInputSchema).optional()
}).strict();

export const VendorCreateManyInputSchema: z.ZodType<Prisma.VendorCreateManyInput> = z.object({
  id: z.number().int().optional(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string(),
  name: z.string(),
  department: z.lazy(() => DepartmentSchema),
  status: z.lazy(() => VendorStatusSchema)
}).strict();

export const VendorUpdateManyMutationInputSchema: z.ZodType<Prisma.VendorUpdateManyMutationInput> = z.object({
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.lazy(() => DepartmentSchema),z.lazy(() => EnumDepartmentFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => VendorStatusSchema),z.lazy(() => EnumVendorStatusFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VendorUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VendorUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.lazy(() => DepartmentSchema),z.lazy(() => EnumDepartmentFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => VendorStatusSchema),z.lazy(() => EnumVendorStatusFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GmailMsgCreateInputSchema: z.ZodType<Prisma.GmailMsgCreateInput> = z.object({
  threadId: z.string(),
  inboxMsgId: z.string(),
  direction: z.lazy(() => EmailDirectionSchema),
  job: z.lazy(() => JobCreateNestedOneWithoutGmailMsgsInputSchema)
}).strict();

export const GmailMsgUncheckedCreateInputSchema: z.ZodType<Prisma.GmailMsgUncheckedCreateInput> = z.object({
  threadId: z.string(),
  inboxMsgId: z.string(),
  jobId: z.string(),
  direction: z.lazy(() => EmailDirectionSchema)
}).strict();

export const GmailMsgUpdateInputSchema: z.ZodType<Prisma.GmailMsgUpdateInput> = z.object({
  threadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inboxMsgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  direction: z.union([ z.lazy(() => EmailDirectionSchema),z.lazy(() => EnumEmailDirectionFieldUpdateOperationsInputSchema) ]).optional(),
  job: z.lazy(() => JobUpdateOneRequiredWithoutGmailMsgsNestedInputSchema).optional()
}).strict();

export const GmailMsgUncheckedUpdateInputSchema: z.ZodType<Prisma.GmailMsgUncheckedUpdateInput> = z.object({
  threadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inboxMsgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  direction: z.union([ z.lazy(() => EmailDirectionSchema),z.lazy(() => EnumEmailDirectionFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GmailMsgCreateManyInputSchema: z.ZodType<Prisma.GmailMsgCreateManyInput> = z.object({
  threadId: z.string(),
  inboxMsgId: z.string(),
  jobId: z.string(),
  direction: z.lazy(() => EmailDirectionSchema)
}).strict();

export const GmailMsgUpdateManyMutationInputSchema: z.ZodType<Prisma.GmailMsgUpdateManyMutationInput> = z.object({
  threadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inboxMsgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  direction: z.union([ z.lazy(() => EmailDirectionSchema),z.lazy(() => EnumEmailDirectionFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GmailMsgUncheckedUpdateManyInputSchema: z.ZodType<Prisma.GmailMsgUncheckedUpdateManyInput> = z.object({
  threadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inboxMsgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  direction: z.union([ z.lazy(() => EmailDirectionSchema),z.lazy(() => EnumEmailDirectionFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobCreateInputSchema: z.ZodType<Prisma.JobCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => JobTypeSchema),
  status: z.lazy(() => JobStatusSchema),
  GmailMsgs: z.lazy(() => GmailMsgCreateNestedManyWithoutJobInputSchema).optional(),
  purchaseOrder: z.lazy(() => PurchaseOrderCreateNestedOneWithoutJobsInputSchema),
  vendor: z.lazy(() => VendorCreateNestedOneWithoutOrdersInputSchema),
  PurchaseOrder: z.lazy(() => PurchaseOrderCreateNestedOneWithoutPrimaryJobInputSchema).optional()
}).strict();

export const JobUncheckedCreateInputSchema: z.ZodType<Prisma.JobUncheckedCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => JobTypeSchema),
  status: z.lazy(() => JobStatusSchema),
  vendorId: z.number().int(),
  purchaseOrderId: z.number().int(),
  GmailMsgs: z.lazy(() => GmailMsgUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUncheckedCreateNestedOneWithoutPrimaryJobInputSchema).optional()
}).strict();

export const JobUpdateInputSchema: z.ZodType<Prisma.JobUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
  GmailMsgs: z.lazy(() => GmailMsgUpdateManyWithoutJobNestedInputSchema).optional(),
  purchaseOrder: z.lazy(() => PurchaseOrderUpdateOneRequiredWithoutJobsNestedInputSchema).optional(),
  vendor: z.lazy(() => VendorUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUpdateOneWithoutPrimaryJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateInputSchema: z.ZodType<Prisma.JobUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseOrderId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  GmailMsgs: z.lazy(() => GmailMsgUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUncheckedUpdateOneWithoutPrimaryJobNestedInputSchema).optional()
}).strict();

export const JobCreateManyInputSchema: z.ZodType<Prisma.JobCreateManyInput> = z.object({
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => JobTypeSchema),
  status: z.lazy(() => JobStatusSchema),
  vendorId: z.number().int(),
  purchaseOrderId: z.number().int()
}).strict();

export const JobUpdateManyMutationInputSchema: z.ZodType<Prisma.JobUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobUncheckedUpdateManyInputSchema: z.ZodType<Prisma.JobUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseOrderId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PurchaseOrderCreateInputSchema: z.ZodType<Prisma.PurchaseOrderCreateInput> = z.object({
  jobs: z.lazy(() => JobCreateNestedManyWithoutPurchaseOrderInputSchema).optional(),
  client: z.lazy(() => ClientCreateNestedOneWithoutOrdersInputSchema),
  primaryJob: z.lazy(() => JobCreateNestedOneWithoutPurchaseOrderInputSchema).optional()
}).strict();

export const PurchaseOrderUncheckedCreateInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  clientId: z.string(),
  primaryJobId: z.string().optional().nullable(),
  jobs: z.lazy(() => JobUncheckedCreateNestedManyWithoutPurchaseOrderInputSchema).optional()
}).strict();

export const PurchaseOrderUpdateInputSchema: z.ZodType<Prisma.PurchaseOrderUpdateInput> = z.object({
  jobs: z.lazy(() => JobUpdateManyWithoutPurchaseOrderNestedInputSchema).optional(),
  client: z.lazy(() => ClientUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  primaryJob: z.lazy(() => JobUpdateOneWithoutPurchaseOrderNestedInputSchema).optional()
}).strict();

export const PurchaseOrderUncheckedUpdateInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primaryJobId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobs: z.lazy(() => JobUncheckedUpdateManyWithoutPurchaseOrderNestedInputSchema).optional()
}).strict();

export const PurchaseOrderCreateManyInputSchema: z.ZodType<Prisma.PurchaseOrderCreateManyInput> = z.object({
  id: z.number().int().optional(),
  clientId: z.string(),
  primaryJobId: z.string().optional().nullable()
}).strict();

export const PurchaseOrderUpdateManyMutationInputSchema: z.ZodType<Prisma.PurchaseOrderUpdateManyMutationInput> = z.object({
}).strict();

export const PurchaseOrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primaryJobId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SalesRepCreateInputSchema: z.ZodType<Prisma.SalesRepCreateInput> = z.object({
  name: z.string(),
  email: z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),
  phone: z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),
  company: z.lazy(() => CompanyCreateNestedOneWithoutSalesRepInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutSalesRepInputSchema),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutSalesRepInputSchema).optional(),
  client: z.lazy(() => ClientCreateNestedManyWithoutSalesRepInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepUncheckedCreateInputSchema: z.ZodType<Prisma.SalesRepUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  username: z.string().min(2).max(10).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),
  name: z.string(),
  email: z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),
  phone: z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' }),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional(),
  client: z.lazy(() => ClientUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepUpdateInputSchema: z.ZodType<Prisma.SalesRepUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutSalesRepNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSalesRepNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  client: z.lazy(() => ClientUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const SalesRepUncheckedUpdateInputSchema: z.ZodType<Prisma.SalesRepUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string().min(2).max(10).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.coerce.number().gte(1, { message: 'Please select a valid company' }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  client: z.lazy(() => ClientUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const SalesRepCreateManyInputSchema: z.ZodType<Prisma.SalesRepCreateManyInput> = z.object({
  id: z.number().int().optional(),
  username: z.string().min(2).max(10).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),
  name: z.string(),
  email: z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),
  phone: z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' })
}).strict();

export const SalesRepUpdateManyMutationInputSchema: z.ZodType<Prisma.SalesRepUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SalesRepUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SalesRepUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string().min(2).max(10).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.coerce.number().gte(1, { message: 'Please select a valid company' }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColorSettingsCreateInputSchema: z.ZodType<Prisma.ColorSettingsCreateInput> = z.object({
  accentColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  primaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  secondaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  auxiliaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  theme: z.lazy(() => ThemeSchema),
  salesRep: z.lazy(() => SalesRepCreateNestedOneWithoutSalesRepColorsInputSchema)
}).strict();

export const ColorSettingsUncheckedCreateInputSchema: z.ZodType<Prisma.ColorSettingsUncheckedCreateInput> = z.object({
  salesRepUsername: z.string().min(2).max(2).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),
  accentColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  primaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  secondaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  auxiliaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  theme: z.lazy(() => ThemeSchema)
}).strict();

export const ColorSettingsUpdateInputSchema: z.ZodType<Prisma.ColorSettingsUpdateInput> = z.object({
  accentColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auxiliaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  theme: z.union([ z.lazy(() => ThemeSchema),z.lazy(() => EnumThemeFieldUpdateOperationsInputSchema) ]).optional(),
  salesRep: z.lazy(() => SalesRepUpdateOneRequiredWithoutSalesRepColorsNestedInputSchema).optional()
}).strict();

export const ColorSettingsUncheckedUpdateInputSchema: z.ZodType<Prisma.ColorSettingsUncheckedUpdateInput> = z.object({
  salesRepUsername: z.union([ z.string().min(2).max(2).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accentColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auxiliaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  theme: z.union([ z.lazy(() => ThemeSchema),z.lazy(() => EnumThemeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColorSettingsCreateManyInputSchema: z.ZodType<Prisma.ColorSettingsCreateManyInput> = z.object({
  salesRepUsername: z.string().min(2).max(2).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),
  accentColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  primaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  secondaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  auxiliaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  theme: z.lazy(() => ThemeSchema)
}).strict();

export const ColorSettingsUpdateManyMutationInputSchema: z.ZodType<Prisma.ColorSettingsUpdateManyMutationInput> = z.object({
  accentColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auxiliaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  theme: z.union([ z.lazy(() => ThemeSchema),z.lazy(() => EnumThemeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColorSettingsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ColorSettingsUncheckedUpdateManyInput> = z.object({
  salesRepUsername: z.union([ z.string().min(2).max(2).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accentColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auxiliaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  theme: z.union([ z.lazy(() => ThemeSchema),z.lazy(() => EnumThemeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserSettingsCreateInputSchema: z.ZodType<Prisma.UserSettingsCreateInput> = z.object({
  settings: z.string().min(2).max(5000).refine((v) => validator.isJSON(v), { message: 'Invalid settings object' }),
  User: z.lazy(() => UserCreateNestedOneWithoutUserSettingsInputSchema)
}).strict();

export const UserSettingsUncheckedCreateInputSchema: z.ZodType<Prisma.UserSettingsUncheckedCreateInput> = z.object({
  username: z.string(),
  settings: z.string().min(2).max(5000).refine((v) => validator.isJSON(v), { message: 'Invalid settings object' })
}).strict();

export const UserSettingsUpdateInputSchema: z.ZodType<Prisma.UserSettingsUpdateInput> = z.object({
  settings: z.union([ z.string().min(2).max(5000).refine((v) => validator.isJSON(v), { message: 'Invalid settings object' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutUserSettingsNestedInputSchema).optional()
}).strict();

export const UserSettingsUncheckedUpdateInputSchema: z.ZodType<Prisma.UserSettingsUncheckedUpdateInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  settings: z.union([ z.string().min(2).max(5000).refine((v) => validator.isJSON(v), { message: 'Invalid settings object' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserSettingsCreateManyInputSchema: z.ZodType<Prisma.UserSettingsCreateManyInput> = z.object({
  username: z.string(),
  settings: z.string().min(2).max(5000).refine((v) => validator.isJSON(v), { message: 'Invalid settings object' })
}).strict();

export const UserSettingsUpdateManyMutationInputSchema: z.ZodType<Prisma.UserSettingsUpdateManyMutationInput> = z.object({
  settings: z.union([ z.string().min(2).max(5000).refine((v) => validator.isJSON(v), { message: 'Invalid settings object' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserSettingsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserSettingsUncheckedUpdateManyInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  settings: z.union([ z.string().min(2).max(5000).refine((v) => validator.isJSON(v), { message: 'Invalid settings object' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientSalesRepCompanyCreateInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateInput> = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
  client: z.lazy(() => ClientCreateNestedOneWithoutClientSalesRepCompanyInputSchema),
  salesRep: z.lazy(() => SalesRepCreateNestedOneWithoutClientSalesRepCompanyInputSchema),
  company: z.lazy(() => CompanyCreateNestedOneWithoutClientSalesRepCompanyInputSchema)
}).strict();

export const ClientSalesRepCompanyUncheckedCreateInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedCreateInput> = z.object({
  clientId: z.string(),
  salesRepUsername: z.string(),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' }),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional()
}).strict();

export const ClientSalesRepCompanyUpdateInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateInput> = z.object({
  fromDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  toDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  client: z.lazy(() => ClientUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema).optional()
}).strict();

export const ClientSalesRepCompanyUncheckedUpdateInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedUpdateInput> = z.object({
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salesRepUsername: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.coerce.number().gte(1, { message: 'Please select a valid company' }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  toDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientSalesRepCompanyCreateManyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateManyInput> = z.object({
  clientId: z.string(),
  salesRepUsername: z.string(),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' }),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional()
}).strict();

export const ClientSalesRepCompanyUpdateManyMutationInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateManyMutationInput> = z.object({
  fromDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  toDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientSalesRepCompanyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedUpdateManyInput> = z.object({
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salesRepUsername: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.coerce.number().gte(1, { message: 'Please select a valid company' }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  toDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientAddressCreateInputSchema: z.ZodType<Prisma.ClientAddressCreateInput> = z.object({
  address: z.string().min(1).max(100),
  state: z.string().min(2).max(2).refine((v) => validator.isAlpha(v), { message: 'Invalid state' }),
  city: z.string().min(1).max(100),
  country: z.string().min(2).max(3).refine((v) => validator.isAlpha(v), { message: 'Invalid country code' }),
  zip: z.string().refine((v) => validator.isPostalCode(v, 'US'), { message: 'Invalid zip' }),
  updatedAt: z.coerce.date().optional(),
  Client: z.lazy(() => ClientCreateNestedOneWithoutClientAddressInputSchema).optional()
}).strict();

export const ClientAddressUncheckedCreateInputSchema: z.ZodType<Prisma.ClientAddressUncheckedCreateInput> = z.object({
  clientId: z.string(),
  address: z.string().min(1).max(100),
  state: z.string().min(2).max(2).refine((v) => validator.isAlpha(v), { message: 'Invalid state' }),
  city: z.string().min(1).max(100),
  country: z.string().min(2).max(3).refine((v) => validator.isAlpha(v), { message: 'Invalid country code' }),
  zip: z.string().refine((v) => validator.isPostalCode(v, 'US'), { message: 'Invalid zip' }),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ClientAddressUpdateInputSchema: z.ZodType<Prisma.ClientAddressUpdateInput> = z.object({
  address: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string().min(2).max(2).refine((v) => validator.isAlpha(v), { message: 'Invalid state' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string().min(2).max(3).refine((v) => validator.isAlpha(v), { message: 'Invalid country code' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string().refine((v) => validator.isPostalCode(v, 'US'), { message: 'Invalid zip' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Client: z.lazy(() => ClientUpdateOneWithoutClientAddressNestedInputSchema).optional()
}).strict();

export const ClientAddressUncheckedUpdateInputSchema: z.ZodType<Prisma.ClientAddressUncheckedUpdateInput> = z.object({
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string().min(2).max(2).refine((v) => validator.isAlpha(v), { message: 'Invalid state' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string().min(2).max(3).refine((v) => validator.isAlpha(v), { message: 'Invalid country code' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string().refine((v) => validator.isPostalCode(v, 'US'), { message: 'Invalid zip' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientAddressCreateManyInputSchema: z.ZodType<Prisma.ClientAddressCreateManyInput> = z.object({
  clientId: z.string(),
  address: z.string().min(1).max(100),
  state: z.string().min(2).max(2).refine((v) => validator.isAlpha(v), { message: 'Invalid state' }),
  city: z.string().min(1).max(100),
  country: z.string().min(2).max(3).refine((v) => validator.isAlpha(v), { message: 'Invalid country code' }),
  zip: z.string().refine((v) => validator.isPostalCode(v, 'US'), { message: 'Invalid zip' }),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ClientAddressUpdateManyMutationInputSchema: z.ZodType<Prisma.ClientAddressUpdateManyMutationInput> = z.object({
  address: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string().min(2).max(2).refine((v) => validator.isAlpha(v), { message: 'Invalid state' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string().min(2).max(3).refine((v) => validator.isAlpha(v), { message: 'Invalid country code' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string().refine((v) => validator.isPostalCode(v, 'US'), { message: 'Invalid zip' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientAddressUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ClientAddressUncheckedUpdateManyInput> = z.object({
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string().min(2).max(2).refine((v) => validator.isAlpha(v), { message: 'Invalid state' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string().min(2).max(3).refine((v) => validator.isAlpha(v), { message: 'Invalid country code' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string().refine((v) => validator.isPostalCode(v, 'US'), { message: 'Invalid zip' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientEmailCreateInputSchema: z.ZodType<Prisma.ClientEmailCreateInput> = z.object({
  email: z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),
  description: z.string().optional().nullable(),
  type: z.lazy(() => EmailTypeSchema),
  updatedAt: z.coerce.date().optional(),
  client: z.lazy(() => ClientCreateNestedOneWithoutEmailsInputSchema)
}).strict();

export const ClientEmailUncheckedCreateInputSchema: z.ZodType<Prisma.ClientEmailUncheckedCreateInput> = z.object({
  email: z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),
  clientId: z.string(),
  description: z.string().optional().nullable(),
  type: z.lazy(() => EmailTypeSchema),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ClientEmailUpdateInputSchema: z.ZodType<Prisma.ClientEmailUpdateInput> = z.object({
  email: z.union([ z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EmailTypeSchema),z.lazy(() => EnumEmailTypeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  client: z.lazy(() => ClientUpdateOneRequiredWithoutEmailsNestedInputSchema).optional()
}).strict();

export const ClientEmailUncheckedUpdateInputSchema: z.ZodType<Prisma.ClientEmailUncheckedUpdateInput> = z.object({
  email: z.union([ z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EmailTypeSchema),z.lazy(() => EnumEmailTypeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientEmailCreateManyInputSchema: z.ZodType<Prisma.ClientEmailCreateManyInput> = z.object({
  email: z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),
  clientId: z.string(),
  description: z.string().optional().nullable(),
  type: z.lazy(() => EmailTypeSchema),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ClientEmailUpdateManyMutationInputSchema: z.ZodType<Prisma.ClientEmailUpdateManyMutationInput> = z.object({
  email: z.union([ z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EmailTypeSchema),z.lazy(() => EnumEmailTypeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientEmailUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ClientEmailUncheckedUpdateManyInput> = z.object({
  email: z.union([ z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EmailTypeSchema),z.lazy(() => EnumEmailTypeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientPhoneCreateInputSchema: z.ZodType<Prisma.ClientPhoneCreateInput> = z.object({
  phone: z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),
  description: z.string().optional().nullable(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => PhoneTypeSchema),
  client: z.lazy(() => ClientCreateNestedOneWithoutPhonesInputSchema)
}).strict();

export const ClientPhoneUncheckedCreateInputSchema: z.ZodType<Prisma.ClientPhoneUncheckedCreateInput> = z.object({
  phone: z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),
  clientId: z.string(),
  description: z.string().optional().nullable(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => PhoneTypeSchema)
}).strict();

export const ClientPhoneUpdateInputSchema: z.ZodType<Prisma.ClientPhoneUpdateInput> = z.object({
  phone: z.union([ z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PhoneTypeSchema),z.lazy(() => EnumPhoneTypeFieldUpdateOperationsInputSchema) ]).optional(),
  client: z.lazy(() => ClientUpdateOneRequiredWithoutPhonesNestedInputSchema).optional()
}).strict();

export const ClientPhoneUncheckedUpdateInputSchema: z.ZodType<Prisma.ClientPhoneUncheckedUpdateInput> = z.object({
  phone: z.union([ z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PhoneTypeSchema),z.lazy(() => EnumPhoneTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientPhoneCreateManyInputSchema: z.ZodType<Prisma.ClientPhoneCreateManyInput> = z.object({
  phone: z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),
  clientId: z.string(),
  description: z.string().optional().nullable(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => PhoneTypeSchema)
}).strict();

export const ClientPhoneUpdateManyMutationInputSchema: z.ZodType<Prisma.ClientPhoneUpdateManyMutationInput> = z.object({
  phone: z.union([ z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PhoneTypeSchema),z.lazy(() => EnumPhoneTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientPhoneUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ClientPhoneUncheckedUpdateManyInput> = z.object({
  phone: z.union([ z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PhoneTypeSchema),z.lazy(() => EnumPhoneTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CompanyCreateInputSchema: z.ZodType<Prisma.CompanyCreateInput> = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  SalesRep: z.lazy(() => SalesRepCreateNestedManyWithoutCompanyInputSchema).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutCompanyInputSchema).optional(),
  Client: z.lazy(() => ClientCreateNestedManyWithoutCompanyInputSchema).optional()
}).strict();

export const CompanyUncheckedCreateInputSchema: z.ZodType<Prisma.CompanyUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  SalesRep: z.lazy(() => SalesRepUncheckedCreateNestedManyWithoutCompanyInputSchema).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutCompanyInputSchema).optional(),
  Client: z.lazy(() => ClientUncheckedCreateNestedManyWithoutCompanyInputSchema).optional()
}).strict();

export const CompanyUpdateInputSchema: z.ZodType<Prisma.CompanyUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  website: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  SalesRep: z.lazy(() => SalesRepUpdateManyWithoutCompanyNestedInputSchema).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutCompanyNestedInputSchema).optional(),
  Client: z.lazy(() => ClientUpdateManyWithoutCompanyNestedInputSchema).optional()
}).strict();

export const CompanyUncheckedUpdateInputSchema: z.ZodType<Prisma.CompanyUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  website: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  SalesRep: z.lazy(() => SalesRepUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional(),
  Client: z.lazy(() => ClientUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional()
}).strict();

export const CompanyCreateManyInputSchema: z.ZodType<Prisma.CompanyCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string()
}).strict();

export const CompanyUpdateManyMutationInputSchema: z.ZodType<Prisma.CompanyUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  website: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CompanyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CompanyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  website: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  username: z.string(),
  role: z.lazy(() => UserRolesSchema),
  session: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  Key: z.lazy(() => KeyCreateNestedManyWithoutUserInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepCreateNestedOneWithoutUserInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  username: z.string(),
  role: z.lazy(() => UserRolesSchema),
  session: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Key: z.lazy(() => KeyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
  session: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  Key: z.lazy(() => KeyUpdateManyWithoutUserNestedInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUpdateOneWithoutUserNestedInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
  session: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Key: z.lazy(() => KeyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  username: z.string(),
  role: z.lazy(() => UserRolesSchema)
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  id: z.string(),
  active_expires: z.bigint(),
  idle_expires: z.bigint(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionInputSchema)
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  id: z.string(),
  user_id: z.string(),
  active_expires: z.bigint(),
  idle_expires: z.bigint()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  idle_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  idle_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  id: z.string(),
  user_id: z.string(),
  active_expires: z.bigint(),
  idle_expires: z.bigint()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  idle_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  idle_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KeyCreateInputSchema: z.ZodType<Prisma.KeyCreateInput> = z.object({
  id: z.string(),
  hashed_password: z.string().optional().nullable(),
  primary: z.boolean(),
  expires: z.bigint().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutKeyInputSchema)
}).strict();

export const KeyUncheckedCreateInputSchema: z.ZodType<Prisma.KeyUncheckedCreateInput> = z.object({
  id: z.string(),
  hashed_password: z.string().optional().nullable(),
  user_id: z.string(),
  primary: z.boolean(),
  expires: z.bigint().optional().nullable()
}).strict();

export const KeyUpdateInputSchema: z.ZodType<Prisma.KeyUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hashed_password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  primary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.bigint(),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutKeyNestedInputSchema).optional()
}).strict();

export const KeyUncheckedUpdateInputSchema: z.ZodType<Prisma.KeyUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hashed_password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.bigint(),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const KeyCreateManyInputSchema: z.ZodType<Prisma.KeyCreateManyInput> = z.object({
  id: z.string(),
  hashed_password: z.string().optional().nullable(),
  user_id: z.string(),
  primary: z.boolean(),
  expires: z.bigint().optional().nullable()
}).strict();

export const KeyUpdateManyMutationInputSchema: z.ZodType<Prisma.KeyUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hashed_password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  primary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.bigint(),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const KeyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.KeyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hashed_password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.bigint(),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const EnumPayMethodFilterSchema: z.ZodType<Prisma.EnumPayMethodFilter> = z.object({
  equals: z.lazy(() => PayMethodSchema).optional(),
  in: z.lazy(() => PayMethodSchema).array().optional(),
  notIn: z.lazy(() => PayMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => NestedEnumPayMethodFilterSchema) ]).optional(),
}).strict();

export const EnumCurrencyFilterSchema: z.ZodType<Prisma.EnumCurrencyFilter> = z.object({
  equals: z.lazy(() => CurrencySchema).optional(),
  in: z.lazy(() => CurrencySchema).array().optional(),
  notIn: z.lazy(() => CurrencySchema).array().optional(),
  not: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => NestedEnumCurrencyFilterSchema) ]).optional(),
}).strict();

export const EnumClientStatusFilterSchema: z.ZodType<Prisma.EnumClientStatusFilter> = z.object({
  equals: z.lazy(() => ClientStatusSchema).optional(),
  in: z.lazy(() => ClientStatusSchema).array().optional(),
  notIn: z.lazy(() => ClientStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => NestedEnumClientStatusFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const ClientEmailListRelationFilterSchema: z.ZodType<Prisma.ClientEmailListRelationFilter> = z.object({
  every: z.lazy(() => ClientEmailWhereInputSchema).optional(),
  some: z.lazy(() => ClientEmailWhereInputSchema).optional(),
  none: z.lazy(() => ClientEmailWhereInputSchema).optional()
}).strict();

export const ClientPhoneListRelationFilterSchema: z.ZodType<Prisma.ClientPhoneListRelationFilter> = z.object({
  every: z.lazy(() => ClientPhoneWhereInputSchema).optional(),
  some: z.lazy(() => ClientPhoneWhereInputSchema).optional(),
  none: z.lazy(() => ClientPhoneWhereInputSchema).optional()
}).strict();

export const PurchaseOrderListRelationFilterSchema: z.ZodType<Prisma.PurchaseOrderListRelationFilter> = z.object({
  every: z.lazy(() => PurchaseOrderWhereInputSchema).optional(),
  some: z.lazy(() => PurchaseOrderWhereInputSchema).optional(),
  none: z.lazy(() => PurchaseOrderWhereInputSchema).optional()
}).strict();

export const ClientSalesRepCompanyListRelationFilterSchema: z.ZodType<Prisma.ClientSalesRepCompanyListRelationFilter> = z.object({
  every: z.lazy(() => ClientSalesRepCompanyWhereInputSchema).optional(),
  some: z.lazy(() => ClientSalesRepCompanyWhereInputSchema).optional(),
  none: z.lazy(() => ClientSalesRepCompanyWhereInputSchema).optional()
}).strict();

export const SalesRepRelationFilterSchema: z.ZodType<Prisma.SalesRepRelationFilter> = z.object({
  is: z.lazy(() => SalesRepWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => SalesRepWhereInputSchema).optional().nullable()
}).strict();

export const CompanyRelationFilterSchema: z.ZodType<Prisma.CompanyRelationFilter> = z.object({
  is: z.lazy(() => CompanyWhereInputSchema).optional(),
  isNot: z.lazy(() => CompanyWhereInputSchema).optional()
}).strict();

export const ClientAddressRelationFilterSchema: z.ZodType<Prisma.ClientAddressRelationFilter> = z.object({
  is: z.lazy(() => ClientAddressWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ClientAddressWhereInputSchema).optional().nullable()
}).strict();

export const ClientEmailOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ClientEmailOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientPhoneOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ClientPhoneOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PurchaseOrderOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PurchaseOrderOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientSalesRepCompanyOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientCountOrderByAggregateInputSchema: z.ZodType<Prisma.ClientCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  companyName: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  addTransactionCharges: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  payMethod: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ClientAvgOrderByAggregateInput> = z.object({
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ClientMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  companyName: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  addTransactionCharges: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  payMethod: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientMinOrderByAggregateInputSchema: z.ZodType<Prisma.ClientMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  companyName: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  addTransactionCharges: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  payMethod: z.lazy(() => SortOrderSchema).optional(),
  currency: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientSumOrderByAggregateInputSchema: z.ZodType<Prisma.ClientSumOrderByAggregateInput> = z.object({
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const EnumPayMethodWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPayMethodWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PayMethodSchema).optional(),
  in: z.lazy(() => PayMethodSchema).array().optional(),
  notIn: z.lazy(() => PayMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => NestedEnumPayMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPayMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPayMethodFilterSchema).optional()
}).strict();

export const EnumCurrencyWithAggregatesFilterSchema: z.ZodType<Prisma.EnumCurrencyWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CurrencySchema).optional(),
  in: z.lazy(() => CurrencySchema).array().optional(),
  notIn: z.lazy(() => CurrencySchema).array().optional(),
  not: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => NestedEnumCurrencyWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCurrencyFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCurrencyFilterSchema).optional()
}).strict();

export const EnumClientStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumClientStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ClientStatusSchema).optional(),
  in: z.lazy(() => ClientStatusSchema).array().optional(),
  notIn: z.lazy(() => ClientStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => NestedEnumClientStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumClientStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumClientStatusFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const EnumDepartmentFilterSchema: z.ZodType<Prisma.EnumDepartmentFilter> = z.object({
  equals: z.lazy(() => DepartmentSchema).optional(),
  in: z.lazy(() => DepartmentSchema).array().optional(),
  notIn: z.lazy(() => DepartmentSchema).array().optional(),
  not: z.union([ z.lazy(() => DepartmentSchema),z.lazy(() => NestedEnumDepartmentFilterSchema) ]).optional(),
}).strict();

export const EnumVendorStatusFilterSchema: z.ZodType<Prisma.EnumVendorStatusFilter> = z.object({
  equals: z.lazy(() => VendorStatusSchema).optional(),
  in: z.lazy(() => VendorStatusSchema).array().optional(),
  notIn: z.lazy(() => VendorStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => VendorStatusSchema),z.lazy(() => NestedEnumVendorStatusFilterSchema) ]).optional(),
}).strict();

export const JobListRelationFilterSchema: z.ZodType<Prisma.JobListRelationFilter> = z.object({
  every: z.lazy(() => JobWhereInputSchema).optional(),
  some: z.lazy(() => JobWhereInputSchema).optional(),
  none: z.lazy(() => JobWhereInputSchema).optional()
}).strict();

export const JobOrderByRelationAggregateInputSchema: z.ZodType<Prisma.JobOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VendorCountOrderByAggregateInputSchema: z.ZodType<Prisma.VendorCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VendorAvgOrderByAggregateInputSchema: z.ZodType<Prisma.VendorAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VendorMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VendorMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VendorMinOrderByAggregateInputSchema: z.ZodType<Prisma.VendorMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  department: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VendorSumOrderByAggregateInputSchema: z.ZodType<Prisma.VendorSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumDepartmentWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDepartmentWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DepartmentSchema).optional(),
  in: z.lazy(() => DepartmentSchema).array().optional(),
  notIn: z.lazy(() => DepartmentSchema).array().optional(),
  not: z.union([ z.lazy(() => DepartmentSchema),z.lazy(() => NestedEnumDepartmentWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDepartmentFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDepartmentFilterSchema).optional()
}).strict();

export const EnumVendorStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumVendorStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => VendorStatusSchema).optional(),
  in: z.lazy(() => VendorStatusSchema).array().optional(),
  notIn: z.lazy(() => VendorStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => VendorStatusSchema),z.lazy(() => NestedEnumVendorStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumVendorStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumVendorStatusFilterSchema).optional()
}).strict();

export const EnumEmailDirectionFilterSchema: z.ZodType<Prisma.EnumEmailDirectionFilter> = z.object({
  equals: z.lazy(() => EmailDirectionSchema).optional(),
  in: z.lazy(() => EmailDirectionSchema).array().optional(),
  notIn: z.lazy(() => EmailDirectionSchema).array().optional(),
  not: z.union([ z.lazy(() => EmailDirectionSchema),z.lazy(() => NestedEnumEmailDirectionFilterSchema) ]).optional(),
}).strict();

export const JobRelationFilterSchema: z.ZodType<Prisma.JobRelationFilter> = z.object({
  is: z.lazy(() => JobWhereInputSchema).optional(),
  isNot: z.lazy(() => JobWhereInputSchema).optional()
}).strict();

export const GmailMsgThreadIdInboxMsgIdJobIdCompoundUniqueInputSchema: z.ZodType<Prisma.GmailMsgThreadIdInboxMsgIdJobIdCompoundUniqueInput> = z.object({
  threadId: z.string(),
  inboxMsgId: z.string(),
  jobId: z.string()
}).strict();

export const GmailMsgCountOrderByAggregateInputSchema: z.ZodType<Prisma.GmailMsgCountOrderByAggregateInput> = z.object({
  threadId: z.lazy(() => SortOrderSchema).optional(),
  inboxMsgId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  direction: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GmailMsgMaxOrderByAggregateInputSchema: z.ZodType<Prisma.GmailMsgMaxOrderByAggregateInput> = z.object({
  threadId: z.lazy(() => SortOrderSchema).optional(),
  inboxMsgId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  direction: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GmailMsgMinOrderByAggregateInputSchema: z.ZodType<Prisma.GmailMsgMinOrderByAggregateInput> = z.object({
  threadId: z.lazy(() => SortOrderSchema).optional(),
  inboxMsgId: z.lazy(() => SortOrderSchema).optional(),
  jobId: z.lazy(() => SortOrderSchema).optional(),
  direction: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumEmailDirectionWithAggregatesFilterSchema: z.ZodType<Prisma.EnumEmailDirectionWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EmailDirectionSchema).optional(),
  in: z.lazy(() => EmailDirectionSchema).array().optional(),
  notIn: z.lazy(() => EmailDirectionSchema).array().optional(),
  not: z.union([ z.lazy(() => EmailDirectionSchema),z.lazy(() => NestedEnumEmailDirectionWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEmailDirectionFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEmailDirectionFilterSchema).optional()
}).strict();

export const DecimalFilterSchema: z.ZodType<Prisma.DecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),DecimalJSLikeListSchema,]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),DecimalJSLikeListSchema,]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const EnumJobTypeFilterSchema: z.ZodType<Prisma.EnumJobTypeFilter> = z.object({
  equals: z.lazy(() => JobTypeSchema).optional(),
  in: z.lazy(() => JobTypeSchema).array().optional(),
  notIn: z.lazy(() => JobTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NestedEnumJobTypeFilterSchema) ]).optional(),
}).strict();

export const EnumJobStatusFilterSchema: z.ZodType<Prisma.EnumJobStatusFilter> = z.object({
  equals: z.lazy(() => JobStatusSchema).optional(),
  in: z.lazy(() => JobStatusSchema).array().optional(),
  notIn: z.lazy(() => JobStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => NestedEnumJobStatusFilterSchema) ]).optional(),
}).strict();

export const GmailMsgListRelationFilterSchema: z.ZodType<Prisma.GmailMsgListRelationFilter> = z.object({
  every: z.lazy(() => GmailMsgWhereInputSchema).optional(),
  some: z.lazy(() => GmailMsgWhereInputSchema).optional(),
  none: z.lazy(() => GmailMsgWhereInputSchema).optional()
}).strict();

export const PurchaseOrderRelationFilterSchema: z.ZodType<Prisma.PurchaseOrderRelationFilter> = z.object({
  is: z.lazy(() => PurchaseOrderWhereInputSchema).optional(),
  isNot: z.lazy(() => PurchaseOrderWhereInputSchema).optional()
}).strict();

export const VendorRelationFilterSchema: z.ZodType<Prisma.VendorRelationFilter> = z.object({
  is: z.lazy(() => VendorWhereInputSchema).optional(),
  isNot: z.lazy(() => VendorWhereInputSchema).optional()
}).strict();

export const GmailMsgOrderByRelationAggregateInputSchema: z.ZodType<Prisma.GmailMsgOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JobCountOrderByAggregateInputSchema: z.ZodType<Prisma.JobCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  purchaseOrderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JobAvgOrderByAggregateInputSchema: z.ZodType<Prisma.JobAvgOrderByAggregateInput> = z.object({
  price: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  purchaseOrderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JobMaxOrderByAggregateInputSchema: z.ZodType<Prisma.JobMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  purchaseOrderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JobMinOrderByAggregateInputSchema: z.ZodType<Prisma.JobMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  purchaseOrderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JobSumOrderByAggregateInputSchema: z.ZodType<Prisma.JobSumOrderByAggregateInput> = z.object({
  price: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  purchaseOrderId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DecimalWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),DecimalJSLikeListSchema,]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),DecimalJSLikeListSchema,]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const EnumJobTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumJobTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => JobTypeSchema).optional(),
  in: z.lazy(() => JobTypeSchema).array().optional(),
  notIn: z.lazy(() => JobTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NestedEnumJobTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumJobTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumJobTypeFilterSchema).optional()
}).strict();

export const EnumJobStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumJobStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => JobStatusSchema).optional(),
  in: z.lazy(() => JobStatusSchema).array().optional(),
  notIn: z.lazy(() => JobStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => NestedEnumJobStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumJobStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumJobStatusFilterSchema).optional()
}).strict();

export const ClientRelationFilterSchema: z.ZodType<Prisma.ClientRelationFilter> = z.object({
  is: z.lazy(() => ClientWhereInputSchema).optional(),
  isNot: z.lazy(() => ClientWhereInputSchema).optional()
}).strict();

export const PurchaseOrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.PurchaseOrderCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  primaryJobId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PurchaseOrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PurchaseOrderAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PurchaseOrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PurchaseOrderMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  primaryJobId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PurchaseOrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.PurchaseOrderMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  primaryJobId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PurchaseOrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.PurchaseOrderSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ClientListRelationFilterSchema: z.ZodType<Prisma.ClientListRelationFilter> = z.object({
  every: z.lazy(() => ClientWhereInputSchema).optional(),
  some: z.lazy(() => ClientWhereInputSchema).optional(),
  none: z.lazy(() => ClientWhereInputSchema).optional()
}).strict();

export const ColorSettingsListRelationFilterSchema: z.ZodType<Prisma.ColorSettingsListRelationFilter> = z.object({
  every: z.lazy(() => ColorSettingsWhereInputSchema).optional(),
  some: z.lazy(() => ColorSettingsWhereInputSchema).optional(),
  none: z.lazy(() => ColorSettingsWhereInputSchema).optional()
}).strict();

export const ClientOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ClientOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColorSettingsOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ColorSettingsOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SalesRepCountOrderByAggregateInputSchema: z.ZodType<Prisma.SalesRepCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SalesRepAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SalesRepAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SalesRepMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SalesRepMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SalesRepMinOrderByAggregateInputSchema: z.ZodType<Prisma.SalesRepMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SalesRepSumOrderByAggregateInputSchema: z.ZodType<Prisma.SalesRepSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumThemeFilterSchema: z.ZodType<Prisma.EnumThemeFilter> = z.object({
  equals: z.lazy(() => ThemeSchema).optional(),
  in: z.lazy(() => ThemeSchema).array().optional(),
  notIn: z.lazy(() => ThemeSchema).array().optional(),
  not: z.union([ z.lazy(() => ThemeSchema),z.lazy(() => NestedEnumThemeFilterSchema) ]).optional(),
}).strict();

export const ColorSettingsCountOrderByAggregateInputSchema: z.ZodType<Prisma.ColorSettingsCountOrderByAggregateInput> = z.object({
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  accentColor: z.lazy(() => SortOrderSchema).optional(),
  primaryColor: z.lazy(() => SortOrderSchema).optional(),
  secondaryColor: z.lazy(() => SortOrderSchema).optional(),
  auxiliaryColor: z.lazy(() => SortOrderSchema).optional(),
  theme: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColorSettingsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ColorSettingsMaxOrderByAggregateInput> = z.object({
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  accentColor: z.lazy(() => SortOrderSchema).optional(),
  primaryColor: z.lazy(() => SortOrderSchema).optional(),
  secondaryColor: z.lazy(() => SortOrderSchema).optional(),
  auxiliaryColor: z.lazy(() => SortOrderSchema).optional(),
  theme: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ColorSettingsMinOrderByAggregateInputSchema: z.ZodType<Prisma.ColorSettingsMinOrderByAggregateInput> = z.object({
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  accentColor: z.lazy(() => SortOrderSchema).optional(),
  primaryColor: z.lazy(() => SortOrderSchema).optional(),
  secondaryColor: z.lazy(() => SortOrderSchema).optional(),
  auxiliaryColor: z.lazy(() => SortOrderSchema).optional(),
  theme: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumThemeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumThemeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ThemeSchema).optional(),
  in: z.lazy(() => ThemeSchema).array().optional(),
  notIn: z.lazy(() => ThemeSchema).array().optional(),
  not: z.union([ z.lazy(() => ThemeSchema),z.lazy(() => NestedEnumThemeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumThemeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumThemeFilterSchema).optional()
}).strict();

export const UserSettingsCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserSettingsCountOrderByAggregateInput> = z.object({
  username: z.lazy(() => SortOrderSchema).optional(),
  settings: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSettingsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserSettingsMaxOrderByAggregateInput> = z.object({
  username: z.lazy(() => SortOrderSchema).optional(),
  settings: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSettingsMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserSettingsMinOrderByAggregateInput> = z.object({
  username: z.lazy(() => SortOrderSchema).optional(),
  settings: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const ClientSalesRepCompanyClientIdSalesRepUsernameCompoundUniqueInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyClientIdSalesRepUsernameCompoundUniqueInput> = z.object({
  clientId: z.string(),
  salesRepUsername: z.string()
}).strict();

export const ClientSalesRepCompanyCountOrderByAggregateInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCountOrderByAggregateInput> = z.object({
  clientId: z.lazy(() => SortOrderSchema).optional(),
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  fromDate: z.lazy(() => SortOrderSchema).optional(),
  toDate: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientSalesRepCompanyAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyAvgOrderByAggregateInput> = z.object({
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientSalesRepCompanyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyMaxOrderByAggregateInput> = z.object({
  clientId: z.lazy(() => SortOrderSchema).optional(),
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  fromDate: z.lazy(() => SortOrderSchema).optional(),
  toDate: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientSalesRepCompanyMinOrderByAggregateInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyMinOrderByAggregateInput> = z.object({
  clientId: z.lazy(() => SortOrderSchema).optional(),
  salesRepUsername: z.lazy(() => SortOrderSchema).optional(),
  companyId: z.lazy(() => SortOrderSchema).optional(),
  fromDate: z.lazy(() => SortOrderSchema).optional(),
  toDate: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientSalesRepCompanySumOrderByAggregateInputSchema: z.ZodType<Prisma.ClientSalesRepCompanySumOrderByAggregateInput> = z.object({
  companyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const ClientAddressCountOrderByAggregateInputSchema: z.ZodType<Prisma.ClientAddressCountOrderByAggregateInput> = z.object({
  clientId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zip: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientAddressMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ClientAddressMaxOrderByAggregateInput> = z.object({
  clientId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zip: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientAddressMinOrderByAggregateInputSchema: z.ZodType<Prisma.ClientAddressMinOrderByAggregateInput> = z.object({
  clientId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zip: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumEmailTypeFilterSchema: z.ZodType<Prisma.EnumEmailTypeFilter> = z.object({
  equals: z.lazy(() => EmailTypeSchema).optional(),
  in: z.lazy(() => EmailTypeSchema).array().optional(),
  notIn: z.lazy(() => EmailTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EmailTypeSchema),z.lazy(() => NestedEnumEmailTypeFilterSchema) ]).optional(),
}).strict();

export const ClientEmailEmailClientIdCompoundUniqueInputSchema: z.ZodType<Prisma.ClientEmailEmailClientIdCompoundUniqueInput> = z.object({
  email: z.string(),
  clientId: z.string()
}).strict();

export const ClientEmailCountOrderByAggregateInputSchema: z.ZodType<Prisma.ClientEmailCountOrderByAggregateInput> = z.object({
  email: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientEmailMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ClientEmailMaxOrderByAggregateInput> = z.object({
  email: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientEmailMinOrderByAggregateInputSchema: z.ZodType<Prisma.ClientEmailMinOrderByAggregateInput> = z.object({
  email: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumEmailTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumEmailTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EmailTypeSchema).optional(),
  in: z.lazy(() => EmailTypeSchema).array().optional(),
  notIn: z.lazy(() => EmailTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EmailTypeSchema),z.lazy(() => NestedEnumEmailTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEmailTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEmailTypeFilterSchema).optional()
}).strict();

export const EnumPhoneTypeFilterSchema: z.ZodType<Prisma.EnumPhoneTypeFilter> = z.object({
  equals: z.lazy(() => PhoneTypeSchema).optional(),
  in: z.lazy(() => PhoneTypeSchema).array().optional(),
  notIn: z.lazy(() => PhoneTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PhoneTypeSchema),z.lazy(() => NestedEnumPhoneTypeFilterSchema) ]).optional(),
}).strict();

export const ClientPhonePhoneClientIdCompoundUniqueInputSchema: z.ZodType<Prisma.ClientPhonePhoneClientIdCompoundUniqueInput> = z.object({
  phone: z.string(),
  clientId: z.string()
}).strict();

export const ClientPhoneCountOrderByAggregateInputSchema: z.ZodType<Prisma.ClientPhoneCountOrderByAggregateInput> = z.object({
  phone: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientPhoneMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ClientPhoneMaxOrderByAggregateInput> = z.object({
  phone: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClientPhoneMinOrderByAggregateInputSchema: z.ZodType<Prisma.ClientPhoneMinOrderByAggregateInput> = z.object({
  phone: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPhoneTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPhoneTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PhoneTypeSchema).optional(),
  in: z.lazy(() => PhoneTypeSchema).array().optional(),
  notIn: z.lazy(() => PhoneTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PhoneTypeSchema),z.lazy(() => NestedEnumPhoneTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPhoneTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPhoneTypeFilterSchema).optional()
}).strict();

export const SalesRepListRelationFilterSchema: z.ZodType<Prisma.SalesRepListRelationFilter> = z.object({
  every: z.lazy(() => SalesRepWhereInputSchema).optional(),
  some: z.lazy(() => SalesRepWhereInputSchema).optional(),
  none: z.lazy(() => SalesRepWhereInputSchema).optional()
}).strict();

export const SalesRepOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SalesRepOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CompanyCountOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zip: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CompanyAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CompanyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zip: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CompanyMinOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  zip: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CompanySumOrderByAggregateInputSchema: z.ZodType<Prisma.CompanySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumUserRolesFilterSchema: z.ZodType<Prisma.EnumUserRolesFilter> = z.object({
  equals: z.lazy(() => UserRolesSchema).optional(),
  in: z.lazy(() => UserRolesSchema).array().optional(),
  notIn: z.lazy(() => UserRolesSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => NestedEnumUserRolesFilterSchema) ]).optional(),
}).strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.object({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional()
}).strict();

export const KeyListRelationFilterSchema: z.ZodType<Prisma.KeyListRelationFilter> = z.object({
  every: z.lazy(() => KeyWhereInputSchema).optional(),
  some: z.lazy(() => KeyWhereInputSchema).optional(),
  none: z.lazy(() => KeyWhereInputSchema).optional()
}).strict();

export const UserSettingsListRelationFilterSchema: z.ZodType<Prisma.UserSettingsListRelationFilter> = z.object({
  every: z.lazy(() => UserSettingsWhereInputSchema).optional(),
  some: z.lazy(() => UserSettingsWhereInputSchema).optional(),
  none: z.lazy(() => UserSettingsWhereInputSchema).optional()
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KeyOrderByRelationAggregateInputSchema: z.ZodType<Prisma.KeyOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSettingsOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserSettingsOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumUserRolesWithAggregatesFilterSchema: z.ZodType<Prisma.EnumUserRolesWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRolesSchema).optional(),
  in: z.lazy(() => UserRolesSchema).array().optional(),
  notIn: z.lazy(() => UserRolesSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => NestedEnumUserRolesWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRolesFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRolesFilterSchema).optional()
}).strict();

export const BigIntFilterSchema: z.ZodType<Prisma.BigIntFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntFilterSchema) ]).optional(),
}).strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  active_expires: z.lazy(() => SortOrderSchema).optional(),
  idle_expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SessionAvgOrderByAggregateInput> = z.object({
  active_expires: z.lazy(() => SortOrderSchema).optional(),
  idle_expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  active_expires: z.lazy(() => SortOrderSchema).optional(),
  idle_expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  active_expires: z.lazy(() => SortOrderSchema).optional(),
  idle_expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionSumOrderByAggregateInputSchema: z.ZodType<Prisma.SessionSumOrderByAggregateInput> = z.object({
  active_expires: z.lazy(() => SortOrderSchema).optional(),
  idle_expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BigIntWithAggregatesFilterSchema: z.ZodType<Prisma.BigIntWithAggregatesFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntFilterSchema).optional()
}).strict();

export const BigIntNullableFilterSchema: z.ZodType<Prisma.BigIntNullableFilter> = z.object({
  equals: z.bigint().optional().nullable(),
  in: z.bigint().array().optional().nullable(),
  notIn: z.bigint().array().optional().nullable(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const KeyCountOrderByAggregateInputSchema: z.ZodType<Prisma.KeyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hashed_password: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  primary: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KeyAvgOrderByAggregateInputSchema: z.ZodType<Prisma.KeyAvgOrderByAggregateInput> = z.object({
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KeyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.KeyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hashed_password: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  primary: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KeyMinOrderByAggregateInputSchema: z.ZodType<Prisma.KeyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  hashed_password: z.lazy(() => SortOrderSchema).optional(),
  user_id: z.lazy(() => SortOrderSchema).optional(),
  primary: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KeySumOrderByAggregateInputSchema: z.ZodType<Prisma.KeySumOrderByAggregateInput> = z.object({
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BigIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BigIntNullableWithAggregatesFilter> = z.object({
  equals: z.bigint().optional().nullable(),
  in: z.bigint().array().optional().nullable(),
  notIn: z.bigint().array().optional().nullable(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntNullableFilterSchema).optional()
}).strict();

export const ClientEmailCreateNestedManyWithoutClientInputSchema: z.ZodType<Prisma.ClientEmailCreateNestedManyWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => ClientEmailCreateWithoutClientInputSchema),z.lazy(() => ClientEmailCreateWithoutClientInputSchema).array(),z.lazy(() => ClientEmailUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientEmailUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientEmailCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientEmailCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientEmailCreateManyClientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientEmailWhereUniqueInputSchema),z.lazy(() => ClientEmailWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientPhoneCreateNestedManyWithoutClientInputSchema: z.ZodType<Prisma.ClientPhoneCreateNestedManyWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => ClientPhoneCreateWithoutClientInputSchema),z.lazy(() => ClientPhoneCreateWithoutClientInputSchema).array(),z.lazy(() => ClientPhoneUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientPhoneUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientPhoneCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientPhoneCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientPhoneCreateManyClientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientPhoneWhereUniqueInputSchema),z.lazy(() => ClientPhoneWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PurchaseOrderCreateNestedManyWithoutClientInputSchema: z.ZodType<Prisma.PurchaseOrderCreateNestedManyWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutClientInputSchema),z.lazy(() => PurchaseOrderCreateWithoutClientInputSchema).array(),z.lazy(() => PurchaseOrderUncheckedCreateWithoutClientInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PurchaseOrderCreateOrConnectWithoutClientInputSchema),z.lazy(() => PurchaseOrderCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PurchaseOrderCreateManyClientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PurchaseOrderWhereUniqueInputSchema),z.lazy(() => PurchaseOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientSalesRepCompanyCreateNestedManyWithoutClientInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateNestedManyWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutClientInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManyClientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SalesRepCreateNestedOneWithoutClientInputSchema: z.ZodType<Prisma.SalesRepCreateNestedOneWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutClientInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutClientInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SalesRepCreateOrConnectWithoutClientInputSchema).optional(),
  connect: z.lazy(() => SalesRepWhereUniqueInputSchema).optional()
}).strict();

export const CompanyCreateNestedOneWithoutClientInputSchema: z.ZodType<Prisma.CompanyCreateNestedOneWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => CompanyCreateWithoutClientInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutClientInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutClientInputSchema).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional()
}).strict();

export const ClientAddressCreateNestedOneWithoutClientInputSchema: z.ZodType<Prisma.ClientAddressCreateNestedOneWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => ClientAddressCreateWithoutClientInputSchema),z.lazy(() => ClientAddressUncheckedCreateWithoutClientInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientAddressCreateOrConnectWithoutClientInputSchema).optional(),
  connect: z.lazy(() => ClientAddressWhereUniqueInputSchema).optional()
}).strict();

export const ClientEmailUncheckedCreateNestedManyWithoutClientInputSchema: z.ZodType<Prisma.ClientEmailUncheckedCreateNestedManyWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => ClientEmailCreateWithoutClientInputSchema),z.lazy(() => ClientEmailCreateWithoutClientInputSchema).array(),z.lazy(() => ClientEmailUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientEmailUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientEmailCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientEmailCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientEmailCreateManyClientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientEmailWhereUniqueInputSchema),z.lazy(() => ClientEmailWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientPhoneUncheckedCreateNestedManyWithoutClientInputSchema: z.ZodType<Prisma.ClientPhoneUncheckedCreateNestedManyWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => ClientPhoneCreateWithoutClientInputSchema),z.lazy(() => ClientPhoneCreateWithoutClientInputSchema).array(),z.lazy(() => ClientPhoneUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientPhoneUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientPhoneCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientPhoneCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientPhoneCreateManyClientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientPhoneWhereUniqueInputSchema),z.lazy(() => ClientPhoneWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PurchaseOrderUncheckedCreateNestedManyWithoutClientInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedCreateNestedManyWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutClientInputSchema),z.lazy(() => PurchaseOrderCreateWithoutClientInputSchema).array(),z.lazy(() => PurchaseOrderUncheckedCreateWithoutClientInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PurchaseOrderCreateOrConnectWithoutClientInputSchema),z.lazy(() => PurchaseOrderCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PurchaseOrderCreateManyClientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PurchaseOrderWhereUniqueInputSchema),z.lazy(() => PurchaseOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientSalesRepCompanyUncheckedCreateNestedManyWithoutClientInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedCreateNestedManyWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutClientInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManyClientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientAddressUncheckedCreateNestedOneWithoutClientInputSchema: z.ZodType<Prisma.ClientAddressUncheckedCreateNestedOneWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => ClientAddressCreateWithoutClientInputSchema),z.lazy(() => ClientAddressUncheckedCreateWithoutClientInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientAddressCreateOrConnectWithoutClientInputSchema).optional(),
  connect: z.lazy(() => ClientAddressWhereUniqueInputSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const EnumPayMethodFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPayMethodFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PayMethodSchema).optional()
}).strict();

export const EnumCurrencyFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumCurrencyFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => CurrencySchema).optional()
}).strict();

export const EnumClientStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumClientStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ClientStatusSchema).optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const ClientEmailUpdateManyWithoutClientNestedInputSchema: z.ZodType<Prisma.ClientEmailUpdateManyWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientEmailCreateWithoutClientInputSchema),z.lazy(() => ClientEmailCreateWithoutClientInputSchema).array(),z.lazy(() => ClientEmailUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientEmailUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientEmailCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientEmailCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientEmailUpsertWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientEmailUpsertWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientEmailCreateManyClientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientEmailWhereUniqueInputSchema),z.lazy(() => ClientEmailWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientEmailWhereUniqueInputSchema),z.lazy(() => ClientEmailWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientEmailWhereUniqueInputSchema),z.lazy(() => ClientEmailWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientEmailWhereUniqueInputSchema),z.lazy(() => ClientEmailWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientEmailUpdateWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientEmailUpdateWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientEmailUpdateManyWithWhereWithoutClientInputSchema),z.lazy(() => ClientEmailUpdateManyWithWhereWithoutClientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientEmailScalarWhereInputSchema),z.lazy(() => ClientEmailScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientPhoneUpdateManyWithoutClientNestedInputSchema: z.ZodType<Prisma.ClientPhoneUpdateManyWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientPhoneCreateWithoutClientInputSchema),z.lazy(() => ClientPhoneCreateWithoutClientInputSchema).array(),z.lazy(() => ClientPhoneUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientPhoneUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientPhoneCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientPhoneCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientPhoneUpsertWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientPhoneUpsertWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientPhoneCreateManyClientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientPhoneWhereUniqueInputSchema),z.lazy(() => ClientPhoneWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientPhoneWhereUniqueInputSchema),z.lazy(() => ClientPhoneWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientPhoneWhereUniqueInputSchema),z.lazy(() => ClientPhoneWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientPhoneWhereUniqueInputSchema),z.lazy(() => ClientPhoneWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientPhoneUpdateWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientPhoneUpdateWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientPhoneUpdateManyWithWhereWithoutClientInputSchema),z.lazy(() => ClientPhoneUpdateManyWithWhereWithoutClientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientPhoneScalarWhereInputSchema),z.lazy(() => ClientPhoneScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PurchaseOrderUpdateManyWithoutClientNestedInputSchema: z.ZodType<Prisma.PurchaseOrderUpdateManyWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutClientInputSchema),z.lazy(() => PurchaseOrderCreateWithoutClientInputSchema).array(),z.lazy(() => PurchaseOrderUncheckedCreateWithoutClientInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PurchaseOrderCreateOrConnectWithoutClientInputSchema),z.lazy(() => PurchaseOrderCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PurchaseOrderUpsertWithWhereUniqueWithoutClientInputSchema),z.lazy(() => PurchaseOrderUpsertWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PurchaseOrderCreateManyClientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PurchaseOrderWhereUniqueInputSchema),z.lazy(() => PurchaseOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PurchaseOrderWhereUniqueInputSchema),z.lazy(() => PurchaseOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PurchaseOrderWhereUniqueInputSchema),z.lazy(() => PurchaseOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PurchaseOrderWhereUniqueInputSchema),z.lazy(() => PurchaseOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PurchaseOrderUpdateWithWhereUniqueWithoutClientInputSchema),z.lazy(() => PurchaseOrderUpdateWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PurchaseOrderUpdateManyWithWhereWithoutClientInputSchema),z.lazy(() => PurchaseOrderUpdateManyWithWhereWithoutClientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PurchaseOrderScalarWhereInputSchema),z.lazy(() => PurchaseOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientSalesRepCompanyUpdateManyWithoutClientNestedInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateManyWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutClientInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManyClientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutClientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema),z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SalesRepUpdateOneRequiredWithoutClientNestedInputSchema: z.ZodType<Prisma.SalesRepUpdateOneRequiredWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutClientInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutClientInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SalesRepCreateOrConnectWithoutClientInputSchema).optional(),
  upsert: z.lazy(() => SalesRepUpsertWithoutClientInputSchema).optional(),
  connect: z.lazy(() => SalesRepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SalesRepUpdateWithoutClientInputSchema),z.lazy(() => SalesRepUncheckedUpdateWithoutClientInputSchema) ]).optional(),
}).strict();

export const CompanyUpdateOneRequiredWithoutClientNestedInputSchema: z.ZodType<Prisma.CompanyUpdateOneRequiredWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => CompanyCreateWithoutClientInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutClientInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutClientInputSchema).optional(),
  upsert: z.lazy(() => CompanyUpsertWithoutClientInputSchema).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CompanyUpdateWithoutClientInputSchema),z.lazy(() => CompanyUncheckedUpdateWithoutClientInputSchema) ]).optional(),
}).strict();

export const ClientAddressUpdateOneWithoutClientNestedInputSchema: z.ZodType<Prisma.ClientAddressUpdateOneWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientAddressCreateWithoutClientInputSchema),z.lazy(() => ClientAddressUncheckedCreateWithoutClientInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientAddressCreateOrConnectWithoutClientInputSchema).optional(),
  upsert: z.lazy(() => ClientAddressUpsertWithoutClientInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => ClientAddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ClientAddressUpdateWithoutClientInputSchema),z.lazy(() => ClientAddressUncheckedUpdateWithoutClientInputSchema) ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ClientEmailUncheckedUpdateManyWithoutClientNestedInputSchema: z.ZodType<Prisma.ClientEmailUncheckedUpdateManyWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientEmailCreateWithoutClientInputSchema),z.lazy(() => ClientEmailCreateWithoutClientInputSchema).array(),z.lazy(() => ClientEmailUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientEmailUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientEmailCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientEmailCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientEmailUpsertWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientEmailUpsertWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientEmailCreateManyClientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientEmailWhereUniqueInputSchema),z.lazy(() => ClientEmailWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientEmailWhereUniqueInputSchema),z.lazy(() => ClientEmailWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientEmailWhereUniqueInputSchema),z.lazy(() => ClientEmailWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientEmailWhereUniqueInputSchema),z.lazy(() => ClientEmailWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientEmailUpdateWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientEmailUpdateWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientEmailUpdateManyWithWhereWithoutClientInputSchema),z.lazy(() => ClientEmailUpdateManyWithWhereWithoutClientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientEmailScalarWhereInputSchema),z.lazy(() => ClientEmailScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientPhoneUncheckedUpdateManyWithoutClientNestedInputSchema: z.ZodType<Prisma.ClientPhoneUncheckedUpdateManyWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientPhoneCreateWithoutClientInputSchema),z.lazy(() => ClientPhoneCreateWithoutClientInputSchema).array(),z.lazy(() => ClientPhoneUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientPhoneUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientPhoneCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientPhoneCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientPhoneUpsertWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientPhoneUpsertWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientPhoneCreateManyClientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientPhoneWhereUniqueInputSchema),z.lazy(() => ClientPhoneWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientPhoneWhereUniqueInputSchema),z.lazy(() => ClientPhoneWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientPhoneWhereUniqueInputSchema),z.lazy(() => ClientPhoneWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientPhoneWhereUniqueInputSchema),z.lazy(() => ClientPhoneWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientPhoneUpdateWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientPhoneUpdateWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientPhoneUpdateManyWithWhereWithoutClientInputSchema),z.lazy(() => ClientPhoneUpdateManyWithWhereWithoutClientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientPhoneScalarWhereInputSchema),z.lazy(() => ClientPhoneScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PurchaseOrderUncheckedUpdateManyWithoutClientNestedInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedUpdateManyWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutClientInputSchema),z.lazy(() => PurchaseOrderCreateWithoutClientInputSchema).array(),z.lazy(() => PurchaseOrderUncheckedCreateWithoutClientInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PurchaseOrderCreateOrConnectWithoutClientInputSchema),z.lazy(() => PurchaseOrderCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PurchaseOrderUpsertWithWhereUniqueWithoutClientInputSchema),z.lazy(() => PurchaseOrderUpsertWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PurchaseOrderCreateManyClientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PurchaseOrderWhereUniqueInputSchema),z.lazy(() => PurchaseOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PurchaseOrderWhereUniqueInputSchema),z.lazy(() => PurchaseOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PurchaseOrderWhereUniqueInputSchema),z.lazy(() => PurchaseOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PurchaseOrderWhereUniqueInputSchema),z.lazy(() => PurchaseOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PurchaseOrderUpdateWithWhereUniqueWithoutClientInputSchema),z.lazy(() => PurchaseOrderUpdateWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PurchaseOrderUpdateManyWithWhereWithoutClientInputSchema),z.lazy(() => PurchaseOrderUpdateManyWithWhereWithoutClientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PurchaseOrderScalarWhereInputSchema),z.lazy(() => PurchaseOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientSalesRepCompanyUncheckedUpdateManyWithoutClientNestedInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedUpdateManyWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutClientInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManyClientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutClientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema),z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientAddressUncheckedUpdateOneWithoutClientNestedInputSchema: z.ZodType<Prisma.ClientAddressUncheckedUpdateOneWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientAddressCreateWithoutClientInputSchema),z.lazy(() => ClientAddressUncheckedCreateWithoutClientInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientAddressCreateOrConnectWithoutClientInputSchema).optional(),
  upsert: z.lazy(() => ClientAddressUpsertWithoutClientInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => ClientAddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ClientAddressUpdateWithoutClientInputSchema),z.lazy(() => ClientAddressUncheckedUpdateWithoutClientInputSchema) ]).optional(),
}).strict();

export const JobCreateNestedManyWithoutVendorInputSchema: z.ZodType<Prisma.JobCreateNestedManyWithoutVendorInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutVendorInputSchema),z.lazy(() => JobCreateWithoutVendorInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutVendorInputSchema),z.lazy(() => JobUncheckedCreateWithoutVendorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutVendorInputSchema),z.lazy(() => JobCreateOrConnectWithoutVendorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyVendorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const JobUncheckedCreateNestedManyWithoutVendorInputSchema: z.ZodType<Prisma.JobUncheckedCreateNestedManyWithoutVendorInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutVendorInputSchema),z.lazy(() => JobCreateWithoutVendorInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutVendorInputSchema),z.lazy(() => JobUncheckedCreateWithoutVendorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutVendorInputSchema),z.lazy(() => JobCreateOrConnectWithoutVendorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyVendorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumDepartmentFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDepartmentFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DepartmentSchema).optional()
}).strict();

export const EnumVendorStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumVendorStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => VendorStatusSchema).optional()
}).strict();

export const JobUpdateManyWithoutVendorNestedInputSchema: z.ZodType<Prisma.JobUpdateManyWithoutVendorNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutVendorInputSchema),z.lazy(() => JobCreateWithoutVendorInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutVendorInputSchema),z.lazy(() => JobUncheckedCreateWithoutVendorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutVendorInputSchema),z.lazy(() => JobCreateOrConnectWithoutVendorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobUpsertWithWhereUniqueWithoutVendorInputSchema),z.lazy(() => JobUpsertWithWhereUniqueWithoutVendorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyVendorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobUpdateWithWhereUniqueWithoutVendorInputSchema),z.lazy(() => JobUpdateWithWhereUniqueWithoutVendorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobUpdateManyWithWhereWithoutVendorInputSchema),z.lazy(() => JobUpdateManyWithWhereWithoutVendorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const JobUncheckedUpdateManyWithoutVendorNestedInputSchema: z.ZodType<Prisma.JobUncheckedUpdateManyWithoutVendorNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutVendorInputSchema),z.lazy(() => JobCreateWithoutVendorInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutVendorInputSchema),z.lazy(() => JobUncheckedCreateWithoutVendorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutVendorInputSchema),z.lazy(() => JobCreateOrConnectWithoutVendorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobUpsertWithWhereUniqueWithoutVendorInputSchema),z.lazy(() => JobUpsertWithWhereUniqueWithoutVendorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyVendorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobUpdateWithWhereUniqueWithoutVendorInputSchema),z.lazy(() => JobUpdateWithWhereUniqueWithoutVendorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobUpdateManyWithWhereWithoutVendorInputSchema),z.lazy(() => JobUpdateManyWithWhereWithoutVendorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const JobCreateNestedOneWithoutGmailMsgsInputSchema: z.ZodType<Prisma.JobCreateNestedOneWithoutGmailMsgsInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutGmailMsgsInputSchema),z.lazy(() => JobUncheckedCreateWithoutGmailMsgsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => JobCreateOrConnectWithoutGmailMsgsInputSchema).optional(),
  connect: z.lazy(() => JobWhereUniqueInputSchema).optional()
}).strict();

export const EnumEmailDirectionFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumEmailDirectionFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => EmailDirectionSchema).optional()
}).strict();

export const JobUpdateOneRequiredWithoutGmailMsgsNestedInputSchema: z.ZodType<Prisma.JobUpdateOneRequiredWithoutGmailMsgsNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutGmailMsgsInputSchema),z.lazy(() => JobUncheckedCreateWithoutGmailMsgsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => JobCreateOrConnectWithoutGmailMsgsInputSchema).optional(),
  upsert: z.lazy(() => JobUpsertWithoutGmailMsgsInputSchema).optional(),
  connect: z.lazy(() => JobWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => JobUpdateWithoutGmailMsgsInputSchema),z.lazy(() => JobUncheckedUpdateWithoutGmailMsgsInputSchema) ]).optional(),
}).strict();

export const GmailMsgCreateNestedManyWithoutJobInputSchema: z.ZodType<Prisma.GmailMsgCreateNestedManyWithoutJobInput> = z.object({
  create: z.union([ z.lazy(() => GmailMsgCreateWithoutJobInputSchema),z.lazy(() => GmailMsgCreateWithoutJobInputSchema).array(),z.lazy(() => GmailMsgUncheckedCreateWithoutJobInputSchema),z.lazy(() => GmailMsgUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GmailMsgCreateOrConnectWithoutJobInputSchema),z.lazy(() => GmailMsgCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GmailMsgCreateManyJobInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GmailMsgWhereUniqueInputSchema),z.lazy(() => GmailMsgWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PurchaseOrderCreateNestedOneWithoutJobsInputSchema: z.ZodType<Prisma.PurchaseOrderCreateNestedOneWithoutJobsInput> = z.object({
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutJobsInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutJobsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PurchaseOrderCreateOrConnectWithoutJobsInputSchema).optional(),
  connect: z.lazy(() => PurchaseOrderWhereUniqueInputSchema).optional()
}).strict();

export const VendorCreateNestedOneWithoutOrdersInputSchema: z.ZodType<Prisma.VendorCreateNestedOneWithoutOrdersInput> = z.object({
  create: z.union([ z.lazy(() => VendorCreateWithoutOrdersInputSchema),z.lazy(() => VendorUncheckedCreateWithoutOrdersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutOrdersInputSchema).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputSchema).optional()
}).strict();

export const PurchaseOrderCreateNestedOneWithoutPrimaryJobInputSchema: z.ZodType<Prisma.PurchaseOrderCreateNestedOneWithoutPrimaryJobInput> = z.object({
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutPrimaryJobInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutPrimaryJobInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PurchaseOrderCreateOrConnectWithoutPrimaryJobInputSchema).optional(),
  connect: z.lazy(() => PurchaseOrderWhereUniqueInputSchema).optional()
}).strict();

export const GmailMsgUncheckedCreateNestedManyWithoutJobInputSchema: z.ZodType<Prisma.GmailMsgUncheckedCreateNestedManyWithoutJobInput> = z.object({
  create: z.union([ z.lazy(() => GmailMsgCreateWithoutJobInputSchema),z.lazy(() => GmailMsgCreateWithoutJobInputSchema).array(),z.lazy(() => GmailMsgUncheckedCreateWithoutJobInputSchema),z.lazy(() => GmailMsgUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GmailMsgCreateOrConnectWithoutJobInputSchema),z.lazy(() => GmailMsgCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GmailMsgCreateManyJobInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => GmailMsgWhereUniqueInputSchema),z.lazy(() => GmailMsgWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PurchaseOrderUncheckedCreateNestedOneWithoutPrimaryJobInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedCreateNestedOneWithoutPrimaryJobInput> = z.object({
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutPrimaryJobInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutPrimaryJobInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PurchaseOrderCreateOrConnectWithoutPrimaryJobInputSchema).optional(),
  connect: z.lazy(() => PurchaseOrderWhereUniqueInputSchema).optional()
}).strict();

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.object({
  set: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const EnumJobTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumJobTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => JobTypeSchema).optional()
}).strict();

export const EnumJobStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumJobStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => JobStatusSchema).optional()
}).strict();

export const GmailMsgUpdateManyWithoutJobNestedInputSchema: z.ZodType<Prisma.GmailMsgUpdateManyWithoutJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => GmailMsgCreateWithoutJobInputSchema),z.lazy(() => GmailMsgCreateWithoutJobInputSchema).array(),z.lazy(() => GmailMsgUncheckedCreateWithoutJobInputSchema),z.lazy(() => GmailMsgUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GmailMsgCreateOrConnectWithoutJobInputSchema),z.lazy(() => GmailMsgCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GmailMsgUpsertWithWhereUniqueWithoutJobInputSchema),z.lazy(() => GmailMsgUpsertWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GmailMsgCreateManyJobInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GmailMsgWhereUniqueInputSchema),z.lazy(() => GmailMsgWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GmailMsgWhereUniqueInputSchema),z.lazy(() => GmailMsgWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GmailMsgWhereUniqueInputSchema),z.lazy(() => GmailMsgWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GmailMsgWhereUniqueInputSchema),z.lazy(() => GmailMsgWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GmailMsgUpdateWithWhereUniqueWithoutJobInputSchema),z.lazy(() => GmailMsgUpdateWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GmailMsgUpdateManyWithWhereWithoutJobInputSchema),z.lazy(() => GmailMsgUpdateManyWithWhereWithoutJobInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GmailMsgScalarWhereInputSchema),z.lazy(() => GmailMsgScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PurchaseOrderUpdateOneRequiredWithoutJobsNestedInputSchema: z.ZodType<Prisma.PurchaseOrderUpdateOneRequiredWithoutJobsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutJobsInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutJobsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PurchaseOrderCreateOrConnectWithoutJobsInputSchema).optional(),
  upsert: z.lazy(() => PurchaseOrderUpsertWithoutJobsInputSchema).optional(),
  connect: z.lazy(() => PurchaseOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PurchaseOrderUpdateWithoutJobsInputSchema),z.lazy(() => PurchaseOrderUncheckedUpdateWithoutJobsInputSchema) ]).optional(),
}).strict();

export const VendorUpdateOneRequiredWithoutOrdersNestedInputSchema: z.ZodType<Prisma.VendorUpdateOneRequiredWithoutOrdersNestedInput> = z.object({
  create: z.union([ z.lazy(() => VendorCreateWithoutOrdersInputSchema),z.lazy(() => VendorUncheckedCreateWithoutOrdersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutOrdersInputSchema).optional(),
  upsert: z.lazy(() => VendorUpsertWithoutOrdersInputSchema).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => VendorUpdateWithoutOrdersInputSchema),z.lazy(() => VendorUncheckedUpdateWithoutOrdersInputSchema) ]).optional(),
}).strict();

export const PurchaseOrderUpdateOneWithoutPrimaryJobNestedInputSchema: z.ZodType<Prisma.PurchaseOrderUpdateOneWithoutPrimaryJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutPrimaryJobInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutPrimaryJobInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PurchaseOrderCreateOrConnectWithoutPrimaryJobInputSchema).optional(),
  upsert: z.lazy(() => PurchaseOrderUpsertWithoutPrimaryJobInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => PurchaseOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PurchaseOrderUpdateWithoutPrimaryJobInputSchema),z.lazy(() => PurchaseOrderUncheckedUpdateWithoutPrimaryJobInputSchema) ]).optional(),
}).strict();

export const GmailMsgUncheckedUpdateManyWithoutJobNestedInputSchema: z.ZodType<Prisma.GmailMsgUncheckedUpdateManyWithoutJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => GmailMsgCreateWithoutJobInputSchema),z.lazy(() => GmailMsgCreateWithoutJobInputSchema).array(),z.lazy(() => GmailMsgUncheckedCreateWithoutJobInputSchema),z.lazy(() => GmailMsgUncheckedCreateWithoutJobInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => GmailMsgCreateOrConnectWithoutJobInputSchema),z.lazy(() => GmailMsgCreateOrConnectWithoutJobInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => GmailMsgUpsertWithWhereUniqueWithoutJobInputSchema),z.lazy(() => GmailMsgUpsertWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  createMany: z.lazy(() => GmailMsgCreateManyJobInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => GmailMsgWhereUniqueInputSchema),z.lazy(() => GmailMsgWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => GmailMsgWhereUniqueInputSchema),z.lazy(() => GmailMsgWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => GmailMsgWhereUniqueInputSchema),z.lazy(() => GmailMsgWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => GmailMsgWhereUniqueInputSchema),z.lazy(() => GmailMsgWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => GmailMsgUpdateWithWhereUniqueWithoutJobInputSchema),z.lazy(() => GmailMsgUpdateWithWhereUniqueWithoutJobInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => GmailMsgUpdateManyWithWhereWithoutJobInputSchema),z.lazy(() => GmailMsgUpdateManyWithWhereWithoutJobInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => GmailMsgScalarWhereInputSchema),z.lazy(() => GmailMsgScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PurchaseOrderUncheckedUpdateOneWithoutPrimaryJobNestedInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedUpdateOneWithoutPrimaryJobNestedInput> = z.object({
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutPrimaryJobInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutPrimaryJobInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PurchaseOrderCreateOrConnectWithoutPrimaryJobInputSchema).optional(),
  upsert: z.lazy(() => PurchaseOrderUpsertWithoutPrimaryJobInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => PurchaseOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PurchaseOrderUpdateWithoutPrimaryJobInputSchema),z.lazy(() => PurchaseOrderUncheckedUpdateWithoutPrimaryJobInputSchema) ]).optional(),
}).strict();

export const JobCreateNestedManyWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobCreateNestedManyWithoutPurchaseOrderInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutPurchaseOrderInputSchema),z.lazy(() => JobCreateOrConnectWithoutPurchaseOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyPurchaseOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientCreateNestedOneWithoutOrdersInputSchema: z.ZodType<Prisma.ClientCreateNestedOneWithoutOrdersInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutOrdersInputSchema),z.lazy(() => ClientUncheckedCreateWithoutOrdersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutOrdersInputSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputSchema).optional()
}).strict();

export const JobCreateNestedOneWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobCreateNestedOneWithoutPurchaseOrderInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => JobCreateOrConnectWithoutPurchaseOrderInputSchema).optional(),
  connect: z.lazy(() => JobWhereUniqueInputSchema).optional()
}).strict();

export const JobUncheckedCreateNestedManyWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobUncheckedCreateNestedManyWithoutPurchaseOrderInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutPurchaseOrderInputSchema),z.lazy(() => JobCreateOrConnectWithoutPurchaseOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyPurchaseOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const JobUpdateManyWithoutPurchaseOrderNestedInputSchema: z.ZodType<Prisma.JobUpdateManyWithoutPurchaseOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutPurchaseOrderInputSchema),z.lazy(() => JobCreateOrConnectWithoutPurchaseOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobUpsertWithWhereUniqueWithoutPurchaseOrderInputSchema),z.lazy(() => JobUpsertWithWhereUniqueWithoutPurchaseOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyPurchaseOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobUpdateWithWhereUniqueWithoutPurchaseOrderInputSchema),z.lazy(() => JobUpdateWithWhereUniqueWithoutPurchaseOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobUpdateManyWithWhereWithoutPurchaseOrderInputSchema),z.lazy(() => JobUpdateManyWithWhereWithoutPurchaseOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientUpdateOneRequiredWithoutOrdersNestedInputSchema: z.ZodType<Prisma.ClientUpdateOneRequiredWithoutOrdersNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutOrdersInputSchema),z.lazy(() => ClientUncheckedCreateWithoutOrdersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutOrdersInputSchema).optional(),
  upsert: z.lazy(() => ClientUpsertWithoutOrdersInputSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ClientUpdateWithoutOrdersInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutOrdersInputSchema) ]).optional(),
}).strict();

export const JobUpdateOneWithoutPurchaseOrderNestedInputSchema: z.ZodType<Prisma.JobUpdateOneWithoutPurchaseOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => JobCreateOrConnectWithoutPurchaseOrderInputSchema).optional(),
  upsert: z.lazy(() => JobUpsertWithoutPurchaseOrderInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => JobWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => JobUpdateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedUpdateWithoutPurchaseOrderInputSchema) ]).optional(),
}).strict();

export const JobUncheckedUpdateManyWithoutPurchaseOrderNestedInputSchema: z.ZodType<Prisma.JobUncheckedUpdateManyWithoutPurchaseOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema).array(),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => JobCreateOrConnectWithoutPurchaseOrderInputSchema),z.lazy(() => JobCreateOrConnectWithoutPurchaseOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => JobUpsertWithWhereUniqueWithoutPurchaseOrderInputSchema),z.lazy(() => JobUpsertWithWhereUniqueWithoutPurchaseOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => JobCreateManyPurchaseOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => JobWhereUniqueInputSchema),z.lazy(() => JobWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => JobUpdateWithWhereUniqueWithoutPurchaseOrderInputSchema),z.lazy(() => JobUpdateWithWhereUniqueWithoutPurchaseOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => JobUpdateManyWithWhereWithoutPurchaseOrderInputSchema),z.lazy(() => JobUpdateManyWithWhereWithoutPurchaseOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CompanyCreateNestedOneWithoutSalesRepInputSchema: z.ZodType<Prisma.CompanyCreateNestedOneWithoutSalesRepInput> = z.object({
  create: z.union([ z.lazy(() => CompanyCreateWithoutSalesRepInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutSalesRepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutSalesRepInputSchema).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutSalesRepInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSalesRepInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSalesRepInputSchema),z.lazy(() => UserUncheckedCreateWithoutSalesRepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSalesRepInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ClientSalesRepCompanyCreateNestedManyWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateNestedManyWithoutSalesRepInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManySalesRepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientCreateNestedManyWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientCreateNestedManyWithoutSalesRepInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutSalesRepInputSchema),z.lazy(() => ClientCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ClientUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ClientUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ClientCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientCreateManySalesRepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ColorSettingsCreateNestedManyWithoutSalesRepInputSchema: z.ZodType<Prisma.ColorSettingsCreateNestedManyWithoutSalesRepInput> = z.object({
  create: z.union([ z.lazy(() => ColorSettingsCreateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ColorSettingsUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColorSettingsCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColorSettingsCreateManySalesRepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ColorSettingsWhereUniqueInputSchema),z.lazy(() => ColorSettingsWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientSalesRepCompanyUncheckedCreateNestedManyWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedCreateNestedManyWithoutSalesRepInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManySalesRepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientUncheckedCreateNestedManyWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientUncheckedCreateNestedManyWithoutSalesRepInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutSalesRepInputSchema),z.lazy(() => ClientCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ClientUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ClientUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ClientCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientCreateManySalesRepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ColorSettingsUncheckedCreateNestedManyWithoutSalesRepInputSchema: z.ZodType<Prisma.ColorSettingsUncheckedCreateNestedManyWithoutSalesRepInput> = z.object({
  create: z.union([ z.lazy(() => ColorSettingsCreateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ColorSettingsUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColorSettingsCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColorSettingsCreateManySalesRepInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ColorSettingsWhereUniqueInputSchema),z.lazy(() => ColorSettingsWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CompanyUpdateOneRequiredWithoutSalesRepNestedInputSchema: z.ZodType<Prisma.CompanyUpdateOneRequiredWithoutSalesRepNestedInput> = z.object({
  create: z.union([ z.lazy(() => CompanyCreateWithoutSalesRepInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutSalesRepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutSalesRepInputSchema).optional(),
  upsert: z.lazy(() => CompanyUpsertWithoutSalesRepInputSchema).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CompanyUpdateWithoutSalesRepInputSchema),z.lazy(() => CompanyUncheckedUpdateWithoutSalesRepInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutSalesRepNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSalesRepNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSalesRepInputSchema),z.lazy(() => UserUncheckedCreateWithoutSalesRepInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSalesRepInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSalesRepInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithoutSalesRepInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSalesRepInputSchema) ]).optional(),
}).strict();

export const ClientSalesRepCompanyUpdateManyWithoutSalesRepNestedInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateManyWithoutSalesRepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManySalesRepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutSalesRepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema),z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientUpdateManyWithoutSalesRepNestedInputSchema: z.ZodType<Prisma.ClientUpdateManyWithoutSalesRepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutSalesRepInputSchema),z.lazy(() => ClientCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ClientUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ClientUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ClientCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientUpsertWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ClientUpsertWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientCreateManySalesRepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientUpdateWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ClientUpdateWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientUpdateManyWithWhereWithoutSalesRepInputSchema),z.lazy(() => ClientUpdateManyWithWhereWithoutSalesRepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientScalarWhereInputSchema),z.lazy(() => ClientScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ColorSettingsUpdateManyWithoutSalesRepNestedInputSchema: z.ZodType<Prisma.ColorSettingsUpdateManyWithoutSalesRepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ColorSettingsCreateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ColorSettingsUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColorSettingsCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ColorSettingsUpsertWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUpsertWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColorSettingsCreateManySalesRepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ColorSettingsWhereUniqueInputSchema),z.lazy(() => ColorSettingsWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ColorSettingsWhereUniqueInputSchema),z.lazy(() => ColorSettingsWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ColorSettingsWhereUniqueInputSchema),z.lazy(() => ColorSettingsWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ColorSettingsWhereUniqueInputSchema),z.lazy(() => ColorSettingsWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ColorSettingsUpdateWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUpdateWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ColorSettingsUpdateManyWithWhereWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUpdateManyWithWhereWithoutSalesRepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ColorSettingsScalarWhereInputSchema),z.lazy(() => ColorSettingsScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientSalesRepCompanyUncheckedUpdateManyWithoutSalesRepNestedInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedUpdateManyWithoutSalesRepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManySalesRepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutSalesRepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema),z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientUncheckedUpdateManyWithoutSalesRepNestedInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateManyWithoutSalesRepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutSalesRepInputSchema),z.lazy(() => ClientCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ClientUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ClientUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ClientCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientUpsertWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ClientUpsertWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientCreateManySalesRepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientUpdateWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ClientUpdateWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientUpdateManyWithWhereWithoutSalesRepInputSchema),z.lazy(() => ClientUpdateManyWithWhereWithoutSalesRepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientScalarWhereInputSchema),z.lazy(() => ClientScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ColorSettingsUncheckedUpdateManyWithoutSalesRepNestedInputSchema: z.ZodType<Prisma.ColorSettingsUncheckedUpdateManyWithoutSalesRepNestedInput> = z.object({
  create: z.union([ z.lazy(() => ColorSettingsCreateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsCreateWithoutSalesRepInputSchema).array(),z.lazy(() => ColorSettingsUncheckedCreateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUncheckedCreateWithoutSalesRepInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ColorSettingsCreateOrConnectWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsCreateOrConnectWithoutSalesRepInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ColorSettingsUpsertWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUpsertWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ColorSettingsCreateManySalesRepInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ColorSettingsWhereUniqueInputSchema),z.lazy(() => ColorSettingsWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ColorSettingsWhereUniqueInputSchema),z.lazy(() => ColorSettingsWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ColorSettingsWhereUniqueInputSchema),z.lazy(() => ColorSettingsWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ColorSettingsWhereUniqueInputSchema),z.lazy(() => ColorSettingsWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ColorSettingsUpdateWithWhereUniqueWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUpdateWithWhereUniqueWithoutSalesRepInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ColorSettingsUpdateManyWithWhereWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUpdateManyWithWhereWithoutSalesRepInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ColorSettingsScalarWhereInputSchema),z.lazy(() => ColorSettingsScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SalesRepCreateNestedOneWithoutSalesRepColorsInputSchema: z.ZodType<Prisma.SalesRepCreateNestedOneWithoutSalesRepColorsInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutSalesRepColorsInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutSalesRepColorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SalesRepCreateOrConnectWithoutSalesRepColorsInputSchema).optional(),
  connect: z.lazy(() => SalesRepWhereUniqueInputSchema).optional()
}).strict();

export const EnumThemeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumThemeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ThemeSchema).optional()
}).strict();

export const SalesRepUpdateOneRequiredWithoutSalesRepColorsNestedInputSchema: z.ZodType<Prisma.SalesRepUpdateOneRequiredWithoutSalesRepColorsNestedInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutSalesRepColorsInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutSalesRepColorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SalesRepCreateOrConnectWithoutSalesRepColorsInputSchema).optional(),
  upsert: z.lazy(() => SalesRepUpsertWithoutSalesRepColorsInputSchema).optional(),
  connect: z.lazy(() => SalesRepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SalesRepUpdateWithoutSalesRepColorsInputSchema),z.lazy(() => SalesRepUncheckedUpdateWithoutSalesRepColorsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutUserSettingsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutUserSettingsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserSettingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserSettingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserSettingsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutUserSettingsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutUserSettingsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserSettingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserSettingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserSettingsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutUserSettingsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithoutUserSettingsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserSettingsInputSchema) ]).optional(),
}).strict();

export const ClientCreateNestedOneWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.ClientCreateNestedOneWithoutClientSalesRepCompanyInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => ClientUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutClientSalesRepCompanyInputSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputSchema).optional()
}).strict();

export const SalesRepCreateNestedOneWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.SalesRepCreateNestedOneWithoutClientSalesRepCompanyInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SalesRepCreateOrConnectWithoutClientSalesRepCompanyInputSchema).optional(),
  connect: z.lazy(() => SalesRepWhereUniqueInputSchema).optional()
}).strict();

export const CompanyCreateNestedOneWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.CompanyCreateNestedOneWithoutClientSalesRepCompanyInput> = z.object({
  create: z.union([ z.lazy(() => CompanyCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutClientSalesRepCompanyInputSchema).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const ClientUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema: z.ZodType<Prisma.ClientUpdateOneRequiredWithoutClientSalesRepCompanyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => ClientUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutClientSalesRepCompanyInputSchema).optional(),
  upsert: z.lazy(() => ClientUpsertWithoutClientSalesRepCompanyInputSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ClientUpdateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutClientSalesRepCompanyInputSchema) ]).optional(),
}).strict();

export const SalesRepUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema: z.ZodType<Prisma.SalesRepUpdateOneRequiredWithoutClientSalesRepCompanyNestedInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SalesRepCreateOrConnectWithoutClientSalesRepCompanyInputSchema).optional(),
  upsert: z.lazy(() => SalesRepUpsertWithoutClientSalesRepCompanyInputSchema).optional(),
  connect: z.lazy(() => SalesRepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SalesRepUpdateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => SalesRepUncheckedUpdateWithoutClientSalesRepCompanyInputSchema) ]).optional(),
}).strict();

export const CompanyUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema: z.ZodType<Prisma.CompanyUpdateOneRequiredWithoutClientSalesRepCompanyNestedInput> = z.object({
  create: z.union([ z.lazy(() => CompanyCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyCreateOrConnectWithoutClientSalesRepCompanyInputSchema).optional(),
  upsert: z.lazy(() => CompanyUpsertWithoutClientSalesRepCompanyInputSchema).optional(),
  connect: z.lazy(() => CompanyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CompanyUpdateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => CompanyUncheckedUpdateWithoutClientSalesRepCompanyInputSchema) ]).optional(),
}).strict();

export const ClientCreateNestedOneWithoutClientAddressInputSchema: z.ZodType<Prisma.ClientCreateNestedOneWithoutClientAddressInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutClientAddressInputSchema),z.lazy(() => ClientUncheckedCreateWithoutClientAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutClientAddressInputSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputSchema).optional()
}).strict();

export const ClientUpdateOneWithoutClientAddressNestedInputSchema: z.ZodType<Prisma.ClientUpdateOneWithoutClientAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutClientAddressInputSchema),z.lazy(() => ClientUncheckedCreateWithoutClientAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutClientAddressInputSchema).optional(),
  upsert: z.lazy(() => ClientUpsertWithoutClientAddressInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => ClientWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ClientUpdateWithoutClientAddressInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutClientAddressInputSchema) ]).optional(),
}).strict();

export const ClientCreateNestedOneWithoutEmailsInputSchema: z.ZodType<Prisma.ClientCreateNestedOneWithoutEmailsInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutEmailsInputSchema),z.lazy(() => ClientUncheckedCreateWithoutEmailsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutEmailsInputSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputSchema).optional()
}).strict();

export const EnumEmailTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumEmailTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => EmailTypeSchema).optional()
}).strict();

export const ClientUpdateOneRequiredWithoutEmailsNestedInputSchema: z.ZodType<Prisma.ClientUpdateOneRequiredWithoutEmailsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutEmailsInputSchema),z.lazy(() => ClientUncheckedCreateWithoutEmailsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutEmailsInputSchema).optional(),
  upsert: z.lazy(() => ClientUpsertWithoutEmailsInputSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ClientUpdateWithoutEmailsInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutEmailsInputSchema) ]).optional(),
}).strict();

export const ClientCreateNestedOneWithoutPhonesInputSchema: z.ZodType<Prisma.ClientCreateNestedOneWithoutPhonesInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutPhonesInputSchema),z.lazy(() => ClientUncheckedCreateWithoutPhonesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutPhonesInputSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputSchema).optional()
}).strict();

export const EnumPhoneTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPhoneTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PhoneTypeSchema).optional()
}).strict();

export const ClientUpdateOneRequiredWithoutPhonesNestedInputSchema: z.ZodType<Prisma.ClientUpdateOneRequiredWithoutPhonesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutPhonesInputSchema),z.lazy(() => ClientUncheckedCreateWithoutPhonesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClientCreateOrConnectWithoutPhonesInputSchema).optional(),
  upsert: z.lazy(() => ClientUpsertWithoutPhonesInputSchema).optional(),
  connect: z.lazy(() => ClientWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ClientUpdateWithoutPhonesInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutPhonesInputSchema) ]).optional(),
}).strict();

export const SalesRepCreateNestedManyWithoutCompanyInputSchema: z.ZodType<Prisma.SalesRepCreateNestedManyWithoutCompanyInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutCompanyInputSchema),z.lazy(() => SalesRepCreateWithoutCompanyInputSchema).array(),z.lazy(() => SalesRepUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SalesRepCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => SalesRepCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SalesRepCreateManyCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SalesRepWhereUniqueInputSchema),z.lazy(() => SalesRepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientSalesRepCompanyCreateNestedManyWithoutCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateNestedManyWithoutCompanyInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutCompanyInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManyCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientCreateNestedManyWithoutCompanyInputSchema: z.ZodType<Prisma.ClientCreateNestedManyWithoutCompanyInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutCompanyInputSchema),z.lazy(() => ClientCreateWithoutCompanyInputSchema).array(),z.lazy(() => ClientUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => ClientUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => ClientCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientCreateManyCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SalesRepUncheckedCreateNestedManyWithoutCompanyInputSchema: z.ZodType<Prisma.SalesRepUncheckedCreateNestedManyWithoutCompanyInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutCompanyInputSchema),z.lazy(() => SalesRepCreateWithoutCompanyInputSchema).array(),z.lazy(() => SalesRepUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SalesRepCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => SalesRepCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SalesRepCreateManyCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SalesRepWhereUniqueInputSchema),z.lazy(() => SalesRepWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientSalesRepCompanyUncheckedCreateNestedManyWithoutCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedCreateNestedManyWithoutCompanyInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutCompanyInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManyCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClientUncheckedCreateNestedManyWithoutCompanyInputSchema: z.ZodType<Prisma.ClientUncheckedCreateNestedManyWithoutCompanyInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutCompanyInputSchema),z.lazy(() => ClientCreateWithoutCompanyInputSchema).array(),z.lazy(() => ClientUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => ClientUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => ClientCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientCreateManyCompanyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SalesRepUpdateManyWithoutCompanyNestedInputSchema: z.ZodType<Prisma.SalesRepUpdateManyWithoutCompanyNestedInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutCompanyInputSchema),z.lazy(() => SalesRepCreateWithoutCompanyInputSchema).array(),z.lazy(() => SalesRepUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SalesRepCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => SalesRepCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SalesRepUpsertWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => SalesRepUpsertWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SalesRepCreateManyCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SalesRepWhereUniqueInputSchema),z.lazy(() => SalesRepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SalesRepWhereUniqueInputSchema),z.lazy(() => SalesRepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SalesRepWhereUniqueInputSchema),z.lazy(() => SalesRepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SalesRepWhereUniqueInputSchema),z.lazy(() => SalesRepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SalesRepUpdateWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => SalesRepUpdateWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SalesRepUpdateManyWithWhereWithoutCompanyInputSchema),z.lazy(() => SalesRepUpdateManyWithWhereWithoutCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SalesRepScalarWhereInputSchema),z.lazy(() => SalesRepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientSalesRepCompanyUpdateManyWithoutCompanyNestedInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateManyWithoutCompanyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutCompanyInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManyCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema),z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientUpdateManyWithoutCompanyNestedInputSchema: z.ZodType<Prisma.ClientUpdateManyWithoutCompanyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutCompanyInputSchema),z.lazy(() => ClientCreateWithoutCompanyInputSchema).array(),z.lazy(() => ClientUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => ClientUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => ClientCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientUpsertWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => ClientUpsertWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientCreateManyCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientUpdateWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => ClientUpdateWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientUpdateManyWithWhereWithoutCompanyInputSchema),z.lazy(() => ClientUpdateManyWithWhereWithoutCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientScalarWhereInputSchema),z.lazy(() => ClientScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SalesRepUncheckedUpdateManyWithoutCompanyNestedInputSchema: z.ZodType<Prisma.SalesRepUncheckedUpdateManyWithoutCompanyNestedInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutCompanyInputSchema),z.lazy(() => SalesRepCreateWithoutCompanyInputSchema).array(),z.lazy(() => SalesRepUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SalesRepCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => SalesRepCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SalesRepUpsertWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => SalesRepUpsertWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SalesRepCreateManyCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SalesRepWhereUniqueInputSchema),z.lazy(() => SalesRepWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SalesRepWhereUniqueInputSchema),z.lazy(() => SalesRepWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SalesRepWhereUniqueInputSchema),z.lazy(() => SalesRepWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SalesRepWhereUniqueInputSchema),z.lazy(() => SalesRepWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SalesRepUpdateWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => SalesRepUpdateWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SalesRepUpdateManyWithWhereWithoutCompanyInputSchema),z.lazy(() => SalesRepUpdateManyWithWhereWithoutCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SalesRepScalarWhereInputSchema),z.lazy(() => SalesRepScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientSalesRepCompanyUncheckedUpdateManyWithoutCompanyNestedInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedUpdateManyWithoutCompanyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyCreateWithoutCompanyInputSchema).array(),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUpsertWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientSalesRepCompanyCreateManyCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUpdateManyWithWhereWithoutCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema),z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClientUncheckedUpdateManyWithoutCompanyNestedInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateManyWithoutCompanyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClientCreateWithoutCompanyInputSchema),z.lazy(() => ClientCreateWithoutCompanyInputSchema).array(),z.lazy(() => ClientUncheckedCreateWithoutCompanyInputSchema),z.lazy(() => ClientUncheckedCreateWithoutCompanyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClientCreateOrConnectWithoutCompanyInputSchema),z.lazy(() => ClientCreateOrConnectWithoutCompanyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClientUpsertWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => ClientUpsertWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClientCreateManyCompanyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClientWhereUniqueInputSchema),z.lazy(() => ClientWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClientUpdateWithWhereUniqueWithoutCompanyInputSchema),z.lazy(() => ClientUpdateWithWhereUniqueWithoutCompanyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClientUpdateManyWithWhereWithoutCompanyInputSchema),z.lazy(() => ClientUpdateManyWithWhereWithoutCompanyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClientScalarWhereInputSchema),z.lazy(() => ClientScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const KeyCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.KeyCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => KeyCreateWithoutUserInputSchema),z.lazy(() => KeyCreateWithoutUserInputSchema).array(),z.lazy(() => KeyUncheckedCreateWithoutUserInputSchema),z.lazy(() => KeyUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeyCreateOrConnectWithoutUserInputSchema),z.lazy(() => KeyCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeyCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => KeyWhereUniqueInputSchema),z.lazy(() => KeyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SalesRepCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.SalesRepCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutUserInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SalesRepCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => SalesRepWhereUniqueInputSchema).optional()
}).strict();

export const UserSettingsCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema),z.lazy(() => UserSettingsCreateWithoutUserInputSchema).array(),z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserSettingsCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserSettingsWhereUniqueInputSchema),z.lazy(() => UserSettingsWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const KeyUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.KeyUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => KeyCreateWithoutUserInputSchema),z.lazy(() => KeyCreateWithoutUserInputSchema).array(),z.lazy(() => KeyUncheckedCreateWithoutUserInputSchema),z.lazy(() => KeyUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeyCreateOrConnectWithoutUserInputSchema),z.lazy(() => KeyCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeyCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => KeyWhereUniqueInputSchema),z.lazy(() => KeyWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SalesRepUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.SalesRepUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutUserInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SalesRepCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => SalesRepWhereUniqueInputSchema).optional()
}).strict();

export const UserSettingsUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema),z.lazy(() => UserSettingsCreateWithoutUserInputSchema).array(),z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserSettingsCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserSettingsWhereUniqueInputSchema),z.lazy(() => UserSettingsWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumUserRolesFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumUserRolesFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => UserRolesSchema).optional()
}).strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const KeyUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.KeyUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => KeyCreateWithoutUserInputSchema),z.lazy(() => KeyCreateWithoutUserInputSchema).array(),z.lazy(() => KeyUncheckedCreateWithoutUserInputSchema),z.lazy(() => KeyUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeyCreateOrConnectWithoutUserInputSchema),z.lazy(() => KeyCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => KeyUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => KeyUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeyCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => KeyWhereUniqueInputSchema),z.lazy(() => KeyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => KeyWhereUniqueInputSchema),z.lazy(() => KeyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => KeyWhereUniqueInputSchema),z.lazy(() => KeyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => KeyWhereUniqueInputSchema),z.lazy(() => KeyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => KeyUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => KeyUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => KeyUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => KeyUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => KeyScalarWhereInputSchema),z.lazy(() => KeyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SalesRepUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.SalesRepUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutUserInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SalesRepCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => SalesRepUpsertWithoutUserInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => SalesRepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SalesRepUpdateWithoutUserInputSchema),z.lazy(() => SalesRepUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const UserSettingsUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserSettingsUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema),z.lazy(() => UserSettingsCreateWithoutUserInputSchema).array(),z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserSettingsUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserSettingsUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserSettingsCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserSettingsWhereUniqueInputSchema),z.lazy(() => UserSettingsWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserSettingsWhereUniqueInputSchema),z.lazy(() => UserSettingsWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserSettingsWhereUniqueInputSchema),z.lazy(() => UserSettingsWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserSettingsWhereUniqueInputSchema),z.lazy(() => UserSettingsWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserSettingsUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserSettingsUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserSettingsUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserSettingsUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserSettingsScalarWhereInputSchema),z.lazy(() => UserSettingsScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const KeyUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.KeyUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => KeyCreateWithoutUserInputSchema),z.lazy(() => KeyCreateWithoutUserInputSchema).array(),z.lazy(() => KeyUncheckedCreateWithoutUserInputSchema),z.lazy(() => KeyUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => KeyCreateOrConnectWithoutUserInputSchema),z.lazy(() => KeyCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => KeyUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => KeyUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => KeyCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => KeyWhereUniqueInputSchema),z.lazy(() => KeyWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => KeyWhereUniqueInputSchema),z.lazy(() => KeyWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => KeyWhereUniqueInputSchema),z.lazy(() => KeyWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => KeyWhereUniqueInputSchema),z.lazy(() => KeyWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => KeyUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => KeyUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => KeyUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => KeyUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => KeyScalarWhereInputSchema),z.lazy(() => KeyScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SalesRepUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.SalesRepUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SalesRepCreateWithoutUserInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SalesRepCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => SalesRepUpsertWithoutUserInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.boolean().optional(),
  connect: z.lazy(() => SalesRepWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SalesRepUpdateWithoutUserInputSchema),z.lazy(() => SalesRepUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const UserSettingsUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserSettingsUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema),z.lazy(() => UserSettingsCreateWithoutUserInputSchema).array(),z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserSettingsUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserSettingsUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserSettingsCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserSettingsWhereUniqueInputSchema),z.lazy(() => UserSettingsWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserSettingsWhereUniqueInputSchema),z.lazy(() => UserSettingsWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserSettingsWhereUniqueInputSchema),z.lazy(() => UserSettingsWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserSettingsWhereUniqueInputSchema),z.lazy(() => UserSettingsWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserSettingsUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserSettingsUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserSettingsUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserSettingsUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserSettingsScalarWhereInputSchema),z.lazy(() => UserSettingsScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSessionInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const BigIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BigIntFieldUpdateOperationsInput> = z.object({
  set: z.bigint().optional(),
  increment: z.bigint().optional(),
  decrement: z.bigint().optional(),
  multiply: z.bigint().optional(),
  divide: z.bigint().optional()
}).strict();

export const UserUpdateOneRequiredWithoutSessionNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutKeyInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutKeyInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutKeyInputSchema),z.lazy(() => UserUncheckedCreateWithoutKeyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutKeyInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const NullableBigIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBigIntFieldUpdateOperationsInput> = z.object({
  set: z.bigint().optional().nullable(),
  increment: z.bigint().optional(),
  decrement: z.bigint().optional(),
  multiply: z.bigint().optional(),
  divide: z.bigint().optional()
}).strict();

export const UserUpdateOneRequiredWithoutKeyNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutKeyNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutKeyInputSchema),z.lazy(() => UserUncheckedCreateWithoutKeyInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutKeyInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutKeyInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithoutKeyInputSchema),z.lazy(() => UserUncheckedUpdateWithoutKeyInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedEnumPayMethodFilterSchema: z.ZodType<Prisma.NestedEnumPayMethodFilter> = z.object({
  equals: z.lazy(() => PayMethodSchema).optional(),
  in: z.lazy(() => PayMethodSchema).array().optional(),
  notIn: z.lazy(() => PayMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => NestedEnumPayMethodFilterSchema) ]).optional(),
}).strict();

export const NestedEnumCurrencyFilterSchema: z.ZodType<Prisma.NestedEnumCurrencyFilter> = z.object({
  equals: z.lazy(() => CurrencySchema).optional(),
  in: z.lazy(() => CurrencySchema).array().optional(),
  notIn: z.lazy(() => CurrencySchema).array().optional(),
  not: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => NestedEnumCurrencyFilterSchema) ]).optional(),
}).strict();

export const NestedEnumClientStatusFilterSchema: z.ZodType<Prisma.NestedEnumClientStatusFilter> = z.object({
  equals: z.lazy(() => ClientStatusSchema).optional(),
  in: z.lazy(() => ClientStatusSchema).array().optional(),
  notIn: z.lazy(() => ClientStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => NestedEnumClientStatusFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedEnumPayMethodWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPayMethodWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PayMethodSchema).optional(),
  in: z.lazy(() => PayMethodSchema).array().optional(),
  notIn: z.lazy(() => PayMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => NestedEnumPayMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPayMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPayMethodFilterSchema).optional()
}).strict();

export const NestedEnumCurrencyWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumCurrencyWithAggregatesFilter> = z.object({
  equals: z.lazy(() => CurrencySchema).optional(),
  in: z.lazy(() => CurrencySchema).array().optional(),
  notIn: z.lazy(() => CurrencySchema).array().optional(),
  not: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => NestedEnumCurrencyWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCurrencyFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCurrencyFilterSchema).optional()
}).strict();

export const NestedEnumClientStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumClientStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ClientStatusSchema).optional(),
  in: z.lazy(() => ClientStatusSchema).array().optional(),
  notIn: z.lazy(() => ClientStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => NestedEnumClientStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumClientStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumClientStatusFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDepartmentFilterSchema: z.ZodType<Prisma.NestedEnumDepartmentFilter> = z.object({
  equals: z.lazy(() => DepartmentSchema).optional(),
  in: z.lazy(() => DepartmentSchema).array().optional(),
  notIn: z.lazy(() => DepartmentSchema).array().optional(),
  not: z.union([ z.lazy(() => DepartmentSchema),z.lazy(() => NestedEnumDepartmentFilterSchema) ]).optional(),
}).strict();

export const NestedEnumVendorStatusFilterSchema: z.ZodType<Prisma.NestedEnumVendorStatusFilter> = z.object({
  equals: z.lazy(() => VendorStatusSchema).optional(),
  in: z.lazy(() => VendorStatusSchema).array().optional(),
  notIn: z.lazy(() => VendorStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => VendorStatusSchema),z.lazy(() => NestedEnumVendorStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDepartmentWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDepartmentWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DepartmentSchema).optional(),
  in: z.lazy(() => DepartmentSchema).array().optional(),
  notIn: z.lazy(() => DepartmentSchema).array().optional(),
  not: z.union([ z.lazy(() => DepartmentSchema),z.lazy(() => NestedEnumDepartmentWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDepartmentFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDepartmentFilterSchema).optional()
}).strict();

export const NestedEnumVendorStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumVendorStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => VendorStatusSchema).optional(),
  in: z.lazy(() => VendorStatusSchema).array().optional(),
  notIn: z.lazy(() => VendorStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => VendorStatusSchema),z.lazy(() => NestedEnumVendorStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumVendorStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumVendorStatusFilterSchema).optional()
}).strict();

export const NestedEnumEmailDirectionFilterSchema: z.ZodType<Prisma.NestedEnumEmailDirectionFilter> = z.object({
  equals: z.lazy(() => EmailDirectionSchema).optional(),
  in: z.lazy(() => EmailDirectionSchema).array().optional(),
  notIn: z.lazy(() => EmailDirectionSchema).array().optional(),
  not: z.union([ z.lazy(() => EmailDirectionSchema),z.lazy(() => NestedEnumEmailDirectionFilterSchema) ]).optional(),
}).strict();

export const NestedEnumEmailDirectionWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumEmailDirectionWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EmailDirectionSchema).optional(),
  in: z.lazy(() => EmailDirectionSchema).array().optional(),
  notIn: z.lazy(() => EmailDirectionSchema).array().optional(),
  not: z.union([ z.lazy(() => EmailDirectionSchema),z.lazy(() => NestedEnumEmailDirectionWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEmailDirectionFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEmailDirectionFilterSchema).optional()
}).strict();

export const NestedDecimalFilterSchema: z.ZodType<Prisma.NestedDecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),DecimalJSLikeListSchema,]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),DecimalJSLikeListSchema,]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const NestedEnumJobTypeFilterSchema: z.ZodType<Prisma.NestedEnumJobTypeFilter> = z.object({
  equals: z.lazy(() => JobTypeSchema).optional(),
  in: z.lazy(() => JobTypeSchema).array().optional(),
  notIn: z.lazy(() => JobTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NestedEnumJobTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumJobStatusFilterSchema: z.ZodType<Prisma.NestedEnumJobStatusFilter> = z.object({
  equals: z.lazy(() => JobStatusSchema).optional(),
  in: z.lazy(() => JobStatusSchema).array().optional(),
  notIn: z.lazy(() => JobStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => NestedEnumJobStatusFilterSchema) ]).optional(),
}).strict();

export const NestedDecimalWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),DecimalJSLikeListSchema,]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),DecimalJSLikeListSchema,]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const NestedEnumJobTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumJobTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => JobTypeSchema).optional(),
  in: z.lazy(() => JobTypeSchema).array().optional(),
  notIn: z.lazy(() => JobTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => NestedEnumJobTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumJobTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumJobTypeFilterSchema).optional()
}).strict();

export const NestedEnumJobStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumJobStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => JobStatusSchema).optional(),
  in: z.lazy(() => JobStatusSchema).array().optional(),
  notIn: z.lazy(() => JobStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => NestedEnumJobStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumJobStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumJobStatusFilterSchema).optional()
}).strict();

export const NestedEnumThemeFilterSchema: z.ZodType<Prisma.NestedEnumThemeFilter> = z.object({
  equals: z.lazy(() => ThemeSchema).optional(),
  in: z.lazy(() => ThemeSchema).array().optional(),
  notIn: z.lazy(() => ThemeSchema).array().optional(),
  not: z.union([ z.lazy(() => ThemeSchema),z.lazy(() => NestedEnumThemeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumThemeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumThemeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ThemeSchema).optional(),
  in: z.lazy(() => ThemeSchema).array().optional(),
  notIn: z.lazy(() => ThemeSchema).array().optional(),
  not: z.union([ z.lazy(() => ThemeSchema),z.lazy(() => NestedEnumThemeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumThemeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumThemeFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumEmailTypeFilterSchema: z.ZodType<Prisma.NestedEnumEmailTypeFilter> = z.object({
  equals: z.lazy(() => EmailTypeSchema).optional(),
  in: z.lazy(() => EmailTypeSchema).array().optional(),
  notIn: z.lazy(() => EmailTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EmailTypeSchema),z.lazy(() => NestedEnumEmailTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumEmailTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumEmailTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => EmailTypeSchema).optional(),
  in: z.lazy(() => EmailTypeSchema).array().optional(),
  notIn: z.lazy(() => EmailTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => EmailTypeSchema),z.lazy(() => NestedEnumEmailTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumEmailTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumEmailTypeFilterSchema).optional()
}).strict();

export const NestedEnumPhoneTypeFilterSchema: z.ZodType<Prisma.NestedEnumPhoneTypeFilter> = z.object({
  equals: z.lazy(() => PhoneTypeSchema).optional(),
  in: z.lazy(() => PhoneTypeSchema).array().optional(),
  notIn: z.lazy(() => PhoneTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PhoneTypeSchema),z.lazy(() => NestedEnumPhoneTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumPhoneTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPhoneTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PhoneTypeSchema).optional(),
  in: z.lazy(() => PhoneTypeSchema).array().optional(),
  notIn: z.lazy(() => PhoneTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PhoneTypeSchema),z.lazy(() => NestedEnumPhoneTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPhoneTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPhoneTypeFilterSchema).optional()
}).strict();

export const NestedEnumUserRolesFilterSchema: z.ZodType<Prisma.NestedEnumUserRolesFilter> = z.object({
  equals: z.lazy(() => UserRolesSchema).optional(),
  in: z.lazy(() => UserRolesSchema).array().optional(),
  notIn: z.lazy(() => UserRolesSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => NestedEnumUserRolesFilterSchema) ]).optional(),
}).strict();

export const NestedEnumUserRolesWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumUserRolesWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRolesSchema).optional(),
  in: z.lazy(() => UserRolesSchema).array().optional(),
  notIn: z.lazy(() => UserRolesSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => NestedEnumUserRolesWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRolesFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRolesFilterSchema).optional()
}).strict();

export const NestedBigIntFilterSchema: z.ZodType<Prisma.NestedBigIntFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntFilterSchema) ]).optional(),
}).strict();

export const NestedBigIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBigIntWithAggregatesFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntFilterSchema).optional()
}).strict();

export const NestedBigIntNullableFilterSchema: z.ZodType<Prisma.NestedBigIntNullableFilter> = z.object({
  equals: z.bigint().optional().nullable(),
  in: z.bigint().array().optional().nullable(),
  notIn: z.bigint().array().optional().nullable(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBigIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBigIntNullableWithAggregatesFilter> = z.object({
  equals: z.bigint().optional().nullable(),
  in: z.bigint().array().optional().nullable(),
  notIn: z.bigint().array().optional().nullable(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const ClientEmailCreateWithoutClientInputSchema: z.ZodType<Prisma.ClientEmailCreateWithoutClientInput> = z.object({
  email: z.string(),
  description: z.string().optional().nullable(),
  type: z.lazy(() => EmailTypeSchema),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ClientEmailUncheckedCreateWithoutClientInputSchema: z.ZodType<Prisma.ClientEmailUncheckedCreateWithoutClientInput> = z.object({
  email: z.string(),
  description: z.string().optional().nullable(),
  type: z.lazy(() => EmailTypeSchema),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ClientEmailCreateOrConnectWithoutClientInputSchema: z.ZodType<Prisma.ClientEmailCreateOrConnectWithoutClientInput> = z.object({
  where: z.lazy(() => ClientEmailWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientEmailCreateWithoutClientInputSchema),z.lazy(() => ClientEmailUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const ClientEmailCreateManyClientInputEnvelopeSchema: z.ZodType<Prisma.ClientEmailCreateManyClientInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ClientEmailCreateManyClientInputSchema),z.lazy(() => ClientEmailCreateManyClientInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ClientPhoneCreateWithoutClientInputSchema: z.ZodType<Prisma.ClientPhoneCreateWithoutClientInput> = z.object({
  phone: z.string(),
  description: z.string().optional().nullable(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => PhoneTypeSchema)
}).strict();

export const ClientPhoneUncheckedCreateWithoutClientInputSchema: z.ZodType<Prisma.ClientPhoneUncheckedCreateWithoutClientInput> = z.object({
  phone: z.string(),
  description: z.string().optional().nullable(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => PhoneTypeSchema)
}).strict();

export const ClientPhoneCreateOrConnectWithoutClientInputSchema: z.ZodType<Prisma.ClientPhoneCreateOrConnectWithoutClientInput> = z.object({
  where: z.lazy(() => ClientPhoneWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientPhoneCreateWithoutClientInputSchema),z.lazy(() => ClientPhoneUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const ClientPhoneCreateManyClientInputEnvelopeSchema: z.ZodType<Prisma.ClientPhoneCreateManyClientInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ClientPhoneCreateManyClientInputSchema),z.lazy(() => ClientPhoneCreateManyClientInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PurchaseOrderCreateWithoutClientInputSchema: z.ZodType<Prisma.PurchaseOrderCreateWithoutClientInput> = z.object({
  jobs: z.lazy(() => JobCreateNestedManyWithoutPurchaseOrderInputSchema).optional(),
  primaryJob: z.lazy(() => JobCreateNestedOneWithoutPurchaseOrderInputSchema).optional()
}).strict();

export const PurchaseOrderUncheckedCreateWithoutClientInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedCreateWithoutClientInput> = z.object({
  id: z.number().optional(),
  primaryJobId: z.string().optional().nullable(),
  jobs: z.lazy(() => JobUncheckedCreateNestedManyWithoutPurchaseOrderInputSchema).optional()
}).strict();

export const PurchaseOrderCreateOrConnectWithoutClientInputSchema: z.ZodType<Prisma.PurchaseOrderCreateOrConnectWithoutClientInput> = z.object({
  where: z.lazy(() => PurchaseOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutClientInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const PurchaseOrderCreateManyClientInputEnvelopeSchema: z.ZodType<Prisma.PurchaseOrderCreateManyClientInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PurchaseOrderCreateManyClientInputSchema),z.lazy(() => PurchaseOrderCreateManyClientInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ClientSalesRepCompanyCreateWithoutClientInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateWithoutClientInput> = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
  salesRep: z.lazy(() => SalesRepCreateNestedOneWithoutClientSalesRepCompanyInputSchema),
  company: z.lazy(() => CompanyCreateNestedOneWithoutClientSalesRepCompanyInputSchema)
}).strict();

export const ClientSalesRepCompanyUncheckedCreateWithoutClientInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedCreateWithoutClientInput> = z.object({
  salesRepUsername: z.string(),
  companyId: z.number(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional()
}).strict();

export const ClientSalesRepCompanyCreateOrConnectWithoutClientInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateOrConnectWithoutClientInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const ClientSalesRepCompanyCreateManyClientInputEnvelopeSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateManyClientInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ClientSalesRepCompanyCreateManyClientInputSchema),z.lazy(() => ClientSalesRepCompanyCreateManyClientInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SalesRepCreateWithoutClientInputSchema: z.ZodType<Prisma.SalesRepCreateWithoutClientInput> = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  company: z.lazy(() => CompanyCreateNestedOneWithoutSalesRepInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutSalesRepInputSchema),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutSalesRepInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepUncheckedCreateWithoutClientInputSchema: z.ZodType<Prisma.SalesRepUncheckedCreateWithoutClientInput> = z.object({
  id: z.number().optional(),
  username: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  companyId: z.number(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepCreateOrConnectWithoutClientInputSchema: z.ZodType<Prisma.SalesRepCreateOrConnectWithoutClientInput> = z.object({
  where: z.lazy(() => SalesRepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SalesRepCreateWithoutClientInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const CompanyCreateWithoutClientInputSchema: z.ZodType<Prisma.CompanyCreateWithoutClientInput> = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  SalesRep: z.lazy(() => SalesRepCreateNestedManyWithoutCompanyInputSchema).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutCompanyInputSchema).optional()
}).strict();

export const CompanyUncheckedCreateWithoutClientInputSchema: z.ZodType<Prisma.CompanyUncheckedCreateWithoutClientInput> = z.object({
  id: z.number().optional(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  SalesRep: z.lazy(() => SalesRepUncheckedCreateNestedManyWithoutCompanyInputSchema).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutCompanyInputSchema).optional()
}).strict();

export const CompanyCreateOrConnectWithoutClientInputSchema: z.ZodType<Prisma.CompanyCreateOrConnectWithoutClientInput> = z.object({
  where: z.lazy(() => CompanyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CompanyCreateWithoutClientInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const ClientAddressCreateWithoutClientInputSchema: z.ZodType<Prisma.ClientAddressCreateWithoutClientInput> = z.object({
  address: z.string(),
  state: z.string(),
  city: z.string(),
  country: z.string(),
  zip: z.string(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ClientAddressUncheckedCreateWithoutClientInputSchema: z.ZodType<Prisma.ClientAddressUncheckedCreateWithoutClientInput> = z.object({
  address: z.string(),
  state: z.string(),
  city: z.string(),
  country: z.string(),
  zip: z.string(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ClientAddressCreateOrConnectWithoutClientInputSchema: z.ZodType<Prisma.ClientAddressCreateOrConnectWithoutClientInput> = z.object({
  where: z.lazy(() => ClientAddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientAddressCreateWithoutClientInputSchema),z.lazy(() => ClientAddressUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const ClientEmailUpsertWithWhereUniqueWithoutClientInputSchema: z.ZodType<Prisma.ClientEmailUpsertWithWhereUniqueWithoutClientInput> = z.object({
  where: z.lazy(() => ClientEmailWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClientEmailUpdateWithoutClientInputSchema),z.lazy(() => ClientEmailUncheckedUpdateWithoutClientInputSchema) ]),
  create: z.union([ z.lazy(() => ClientEmailCreateWithoutClientInputSchema),z.lazy(() => ClientEmailUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const ClientEmailUpdateWithWhereUniqueWithoutClientInputSchema: z.ZodType<Prisma.ClientEmailUpdateWithWhereUniqueWithoutClientInput> = z.object({
  where: z.lazy(() => ClientEmailWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClientEmailUpdateWithoutClientInputSchema),z.lazy(() => ClientEmailUncheckedUpdateWithoutClientInputSchema) ]),
}).strict();

export const ClientEmailUpdateManyWithWhereWithoutClientInputSchema: z.ZodType<Prisma.ClientEmailUpdateManyWithWhereWithoutClientInput> = z.object({
  where: z.lazy(() => ClientEmailScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClientEmailUpdateManyMutationInputSchema),z.lazy(() => ClientEmailUncheckedUpdateManyWithoutEmailsInputSchema) ]),
}).strict();

export const ClientEmailScalarWhereInputSchema: z.ZodType<Prisma.ClientEmailScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClientEmailScalarWhereInputSchema),z.lazy(() => ClientEmailScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientEmailScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientEmailScalarWhereInputSchema),z.lazy(() => ClientEmailScalarWhereInputSchema).array() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumEmailTypeFilterSchema),z.lazy(() => EmailTypeSchema) ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ClientPhoneUpsertWithWhereUniqueWithoutClientInputSchema: z.ZodType<Prisma.ClientPhoneUpsertWithWhereUniqueWithoutClientInput> = z.object({
  where: z.lazy(() => ClientPhoneWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClientPhoneUpdateWithoutClientInputSchema),z.lazy(() => ClientPhoneUncheckedUpdateWithoutClientInputSchema) ]),
  create: z.union([ z.lazy(() => ClientPhoneCreateWithoutClientInputSchema),z.lazy(() => ClientPhoneUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const ClientPhoneUpdateWithWhereUniqueWithoutClientInputSchema: z.ZodType<Prisma.ClientPhoneUpdateWithWhereUniqueWithoutClientInput> = z.object({
  where: z.lazy(() => ClientPhoneWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClientPhoneUpdateWithoutClientInputSchema),z.lazy(() => ClientPhoneUncheckedUpdateWithoutClientInputSchema) ]),
}).strict();

export const ClientPhoneUpdateManyWithWhereWithoutClientInputSchema: z.ZodType<Prisma.ClientPhoneUpdateManyWithWhereWithoutClientInput> = z.object({
  where: z.lazy(() => ClientPhoneScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClientPhoneUpdateManyMutationInputSchema),z.lazy(() => ClientPhoneUncheckedUpdateManyWithoutPhonesInputSchema) ]),
}).strict();

export const ClientPhoneScalarWhereInputSchema: z.ZodType<Prisma.ClientPhoneScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClientPhoneScalarWhereInputSchema),z.lazy(() => ClientPhoneScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientPhoneScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientPhoneScalarWhereInputSchema),z.lazy(() => ClientPhoneScalarWhereInputSchema).array() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumPhoneTypeFilterSchema),z.lazy(() => PhoneTypeSchema) ]).optional(),
}).strict();

export const PurchaseOrderUpsertWithWhereUniqueWithoutClientInputSchema: z.ZodType<Prisma.PurchaseOrderUpsertWithWhereUniqueWithoutClientInput> = z.object({
  where: z.lazy(() => PurchaseOrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PurchaseOrderUpdateWithoutClientInputSchema),z.lazy(() => PurchaseOrderUncheckedUpdateWithoutClientInputSchema) ]),
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutClientInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const PurchaseOrderUpdateWithWhereUniqueWithoutClientInputSchema: z.ZodType<Prisma.PurchaseOrderUpdateWithWhereUniqueWithoutClientInput> = z.object({
  where: z.lazy(() => PurchaseOrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PurchaseOrderUpdateWithoutClientInputSchema),z.lazy(() => PurchaseOrderUncheckedUpdateWithoutClientInputSchema) ]),
}).strict();

export const PurchaseOrderUpdateManyWithWhereWithoutClientInputSchema: z.ZodType<Prisma.PurchaseOrderUpdateManyWithWhereWithoutClientInput> = z.object({
  where: z.lazy(() => PurchaseOrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PurchaseOrderUpdateManyMutationInputSchema),z.lazy(() => PurchaseOrderUncheckedUpdateManyWithoutOrdersInputSchema) ]),
}).strict();

export const PurchaseOrderScalarWhereInputSchema: z.ZodType<Prisma.PurchaseOrderScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PurchaseOrderScalarWhereInputSchema),z.lazy(() => PurchaseOrderScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PurchaseOrderScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PurchaseOrderScalarWhereInputSchema),z.lazy(() => PurchaseOrderScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  primaryJobId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ClientSalesRepCompanyUpsertWithWhereUniqueWithoutClientInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpsertWithWhereUniqueWithoutClientInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedUpdateWithoutClientInputSchema) ]),
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const ClientSalesRepCompanyUpdateWithWhereUniqueWithoutClientInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateWithWhereUniqueWithoutClientInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithoutClientInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedUpdateWithoutClientInputSchema) ]),
}).strict();

export const ClientSalesRepCompanyUpdateManyWithWhereWithoutClientInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateManyWithWhereWithoutClientInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateManyMutationInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutClientSalesRepCompanyInputSchema) ]),
}).strict();

export const ClientSalesRepCompanyScalarWhereInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema),z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema),z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema).array() ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  salesRepUsername: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  companyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  fromDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  toDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const SalesRepUpsertWithoutClientInputSchema: z.ZodType<Prisma.SalesRepUpsertWithoutClientInput> = z.object({
  update: z.union([ z.lazy(() => SalesRepUpdateWithoutClientInputSchema),z.lazy(() => SalesRepUncheckedUpdateWithoutClientInputSchema) ]),
  create: z.union([ z.lazy(() => SalesRepCreateWithoutClientInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const SalesRepUpdateWithoutClientInputSchema: z.ZodType<Prisma.SalesRepUpdateWithoutClientInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutSalesRepNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSalesRepNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const SalesRepUncheckedUpdateWithoutClientInputSchema: z.ZodType<Prisma.SalesRepUncheckedUpdateWithoutClientInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const CompanyUpsertWithoutClientInputSchema: z.ZodType<Prisma.CompanyUpsertWithoutClientInput> = z.object({
  update: z.union([ z.lazy(() => CompanyUpdateWithoutClientInputSchema),z.lazy(() => CompanyUncheckedUpdateWithoutClientInputSchema) ]),
  create: z.union([ z.lazy(() => CompanyCreateWithoutClientInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const CompanyUpdateWithoutClientInputSchema: z.ZodType<Prisma.CompanyUpdateWithoutClientInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  website: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  SalesRep: z.lazy(() => SalesRepUpdateManyWithoutCompanyNestedInputSchema).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutCompanyNestedInputSchema).optional()
}).strict();

export const CompanyUncheckedUpdateWithoutClientInputSchema: z.ZodType<Prisma.CompanyUncheckedUpdateWithoutClientInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  website: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  SalesRep: z.lazy(() => SalesRepUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional()
}).strict();

export const ClientAddressUpsertWithoutClientInputSchema: z.ZodType<Prisma.ClientAddressUpsertWithoutClientInput> = z.object({
  update: z.union([ z.lazy(() => ClientAddressUpdateWithoutClientInputSchema),z.lazy(() => ClientAddressUncheckedUpdateWithoutClientInputSchema) ]),
  create: z.union([ z.lazy(() => ClientAddressCreateWithoutClientInputSchema),z.lazy(() => ClientAddressUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const ClientAddressUpdateWithoutClientInputSchema: z.ZodType<Prisma.ClientAddressUpdateWithoutClientInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientAddressUncheckedUpdateWithoutClientInputSchema: z.ZodType<Prisma.ClientAddressUncheckedUpdateWithoutClientInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobCreateWithoutVendorInputSchema: z.ZodType<Prisma.JobCreateWithoutVendorInput> = z.object({
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => JobTypeSchema),
  status: z.lazy(() => JobStatusSchema),
  GmailMsgs: z.lazy(() => GmailMsgCreateNestedManyWithoutJobInputSchema).optional(),
  purchaseOrder: z.lazy(() => PurchaseOrderCreateNestedOneWithoutJobsInputSchema),
  PurchaseOrder: z.lazy(() => PurchaseOrderCreateNestedOneWithoutPrimaryJobInputSchema).optional()
}).strict();

export const JobUncheckedCreateWithoutVendorInputSchema: z.ZodType<Prisma.JobUncheckedCreateWithoutVendorInput> = z.object({
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => JobTypeSchema),
  status: z.lazy(() => JobStatusSchema),
  purchaseOrderId: z.number(),
  GmailMsgs: z.lazy(() => GmailMsgUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUncheckedCreateNestedOneWithoutPrimaryJobInputSchema).optional()
}).strict();

export const JobCreateOrConnectWithoutVendorInputSchema: z.ZodType<Prisma.JobCreateOrConnectWithoutVendorInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => JobCreateWithoutVendorInputSchema),z.lazy(() => JobUncheckedCreateWithoutVendorInputSchema) ]),
}).strict();

export const JobCreateManyVendorInputEnvelopeSchema: z.ZodType<Prisma.JobCreateManyVendorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => JobCreateManyVendorInputSchema),z.lazy(() => JobCreateManyVendorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const JobUpsertWithWhereUniqueWithoutVendorInputSchema: z.ZodType<Prisma.JobUpsertWithWhereUniqueWithoutVendorInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => JobUpdateWithoutVendorInputSchema),z.lazy(() => JobUncheckedUpdateWithoutVendorInputSchema) ]),
  create: z.union([ z.lazy(() => JobCreateWithoutVendorInputSchema),z.lazy(() => JobUncheckedCreateWithoutVendorInputSchema) ]),
}).strict();

export const JobUpdateWithWhereUniqueWithoutVendorInputSchema: z.ZodType<Prisma.JobUpdateWithWhereUniqueWithoutVendorInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => JobUpdateWithoutVendorInputSchema),z.lazy(() => JobUncheckedUpdateWithoutVendorInputSchema) ]),
}).strict();

export const JobUpdateManyWithWhereWithoutVendorInputSchema: z.ZodType<Prisma.JobUpdateManyWithWhereWithoutVendorInput> = z.object({
  where: z.lazy(() => JobScalarWhereInputSchema),
  data: z.union([ z.lazy(() => JobUpdateManyMutationInputSchema),z.lazy(() => JobUncheckedUpdateManyWithoutOrdersInputSchema) ]),
}).strict();

export const JobScalarWhereInputSchema: z.ZodType<Prisma.JobScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => JobScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => JobScalarWhereInputSchema),z.lazy(() => JobScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumJobTypeFilterSchema),z.lazy(() => JobTypeSchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumJobStatusFilterSchema),z.lazy(() => JobStatusSchema) ]).optional(),
  vendorId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  purchaseOrderId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const JobCreateWithoutGmailMsgsInputSchema: z.ZodType<Prisma.JobCreateWithoutGmailMsgsInput> = z.object({
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => JobTypeSchema),
  status: z.lazy(() => JobStatusSchema),
  purchaseOrder: z.lazy(() => PurchaseOrderCreateNestedOneWithoutJobsInputSchema),
  vendor: z.lazy(() => VendorCreateNestedOneWithoutOrdersInputSchema),
  PurchaseOrder: z.lazy(() => PurchaseOrderCreateNestedOneWithoutPrimaryJobInputSchema).optional()
}).strict();

export const JobUncheckedCreateWithoutGmailMsgsInputSchema: z.ZodType<Prisma.JobUncheckedCreateWithoutGmailMsgsInput> = z.object({
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => JobTypeSchema),
  status: z.lazy(() => JobStatusSchema),
  vendorId: z.number(),
  purchaseOrderId: z.number(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUncheckedCreateNestedOneWithoutPrimaryJobInputSchema).optional()
}).strict();

export const JobCreateOrConnectWithoutGmailMsgsInputSchema: z.ZodType<Prisma.JobCreateOrConnectWithoutGmailMsgsInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => JobCreateWithoutGmailMsgsInputSchema),z.lazy(() => JobUncheckedCreateWithoutGmailMsgsInputSchema) ]),
}).strict();

export const JobUpsertWithoutGmailMsgsInputSchema: z.ZodType<Prisma.JobUpsertWithoutGmailMsgsInput> = z.object({
  update: z.union([ z.lazy(() => JobUpdateWithoutGmailMsgsInputSchema),z.lazy(() => JobUncheckedUpdateWithoutGmailMsgsInputSchema) ]),
  create: z.union([ z.lazy(() => JobCreateWithoutGmailMsgsInputSchema),z.lazy(() => JobUncheckedCreateWithoutGmailMsgsInputSchema) ]),
}).strict();

export const JobUpdateWithoutGmailMsgsInputSchema: z.ZodType<Prisma.JobUpdateWithoutGmailMsgsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseOrder: z.lazy(() => PurchaseOrderUpdateOneRequiredWithoutJobsNestedInputSchema).optional(),
  vendor: z.lazy(() => VendorUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUpdateOneWithoutPrimaryJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateWithoutGmailMsgsInputSchema: z.ZodType<Prisma.JobUncheckedUpdateWithoutGmailMsgsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseOrderId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUncheckedUpdateOneWithoutPrimaryJobNestedInputSchema).optional()
}).strict();

export const GmailMsgCreateWithoutJobInputSchema: z.ZodType<Prisma.GmailMsgCreateWithoutJobInput> = z.object({
  threadId: z.string(),
  inboxMsgId: z.string(),
  direction: z.lazy(() => EmailDirectionSchema)
}).strict();

export const GmailMsgUncheckedCreateWithoutJobInputSchema: z.ZodType<Prisma.GmailMsgUncheckedCreateWithoutJobInput> = z.object({
  threadId: z.string(),
  inboxMsgId: z.string(),
  direction: z.lazy(() => EmailDirectionSchema)
}).strict();

export const GmailMsgCreateOrConnectWithoutJobInputSchema: z.ZodType<Prisma.GmailMsgCreateOrConnectWithoutJobInput> = z.object({
  where: z.lazy(() => GmailMsgWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => GmailMsgCreateWithoutJobInputSchema),z.lazy(() => GmailMsgUncheckedCreateWithoutJobInputSchema) ]),
}).strict();

export const GmailMsgCreateManyJobInputEnvelopeSchema: z.ZodType<Prisma.GmailMsgCreateManyJobInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => GmailMsgCreateManyJobInputSchema),z.lazy(() => GmailMsgCreateManyJobInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PurchaseOrderCreateWithoutJobsInputSchema: z.ZodType<Prisma.PurchaseOrderCreateWithoutJobsInput> = z.object({
  client: z.lazy(() => ClientCreateNestedOneWithoutOrdersInputSchema),
  primaryJob: z.lazy(() => JobCreateNestedOneWithoutPurchaseOrderInputSchema).optional()
}).strict();

export const PurchaseOrderUncheckedCreateWithoutJobsInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedCreateWithoutJobsInput> = z.object({
  id: z.number().optional(),
  clientId: z.string(),
  primaryJobId: z.string().optional().nullable()
}).strict();

export const PurchaseOrderCreateOrConnectWithoutJobsInputSchema: z.ZodType<Prisma.PurchaseOrderCreateOrConnectWithoutJobsInput> = z.object({
  where: z.lazy(() => PurchaseOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutJobsInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutJobsInputSchema) ]),
}).strict();

export const VendorCreateWithoutOrdersInputSchema: z.ZodType<Prisma.VendorCreateWithoutOrdersInput> = z.object({
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string(),
  name: z.string(),
  department: z.lazy(() => DepartmentSchema),
  status: z.lazy(() => VendorStatusSchema)
}).strict();

export const VendorUncheckedCreateWithoutOrdersInputSchema: z.ZodType<Prisma.VendorUncheckedCreateWithoutOrdersInput> = z.object({
  id: z.number().optional(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string(),
  name: z.string(),
  department: z.lazy(() => DepartmentSchema),
  status: z.lazy(() => VendorStatusSchema)
}).strict();

export const VendorCreateOrConnectWithoutOrdersInputSchema: z.ZodType<Prisma.VendorCreateOrConnectWithoutOrdersInput> = z.object({
  where: z.lazy(() => VendorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VendorCreateWithoutOrdersInputSchema),z.lazy(() => VendorUncheckedCreateWithoutOrdersInputSchema) ]),
}).strict();

export const PurchaseOrderCreateWithoutPrimaryJobInputSchema: z.ZodType<Prisma.PurchaseOrderCreateWithoutPrimaryJobInput> = z.object({
  jobs: z.lazy(() => JobCreateNestedManyWithoutPurchaseOrderInputSchema).optional(),
  client: z.lazy(() => ClientCreateNestedOneWithoutOrdersInputSchema)
}).strict();

export const PurchaseOrderUncheckedCreateWithoutPrimaryJobInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedCreateWithoutPrimaryJobInput> = z.object({
  id: z.number().optional(),
  clientId: z.string(),
  jobs: z.lazy(() => JobUncheckedCreateNestedManyWithoutPurchaseOrderInputSchema).optional()
}).strict();

export const PurchaseOrderCreateOrConnectWithoutPrimaryJobInputSchema: z.ZodType<Prisma.PurchaseOrderCreateOrConnectWithoutPrimaryJobInput> = z.object({
  where: z.lazy(() => PurchaseOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutPrimaryJobInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutPrimaryJobInputSchema) ]),
}).strict();

export const GmailMsgUpsertWithWhereUniqueWithoutJobInputSchema: z.ZodType<Prisma.GmailMsgUpsertWithWhereUniqueWithoutJobInput> = z.object({
  where: z.lazy(() => GmailMsgWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => GmailMsgUpdateWithoutJobInputSchema),z.lazy(() => GmailMsgUncheckedUpdateWithoutJobInputSchema) ]),
  create: z.union([ z.lazy(() => GmailMsgCreateWithoutJobInputSchema),z.lazy(() => GmailMsgUncheckedCreateWithoutJobInputSchema) ]),
}).strict();

export const GmailMsgUpdateWithWhereUniqueWithoutJobInputSchema: z.ZodType<Prisma.GmailMsgUpdateWithWhereUniqueWithoutJobInput> = z.object({
  where: z.lazy(() => GmailMsgWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => GmailMsgUpdateWithoutJobInputSchema),z.lazy(() => GmailMsgUncheckedUpdateWithoutJobInputSchema) ]),
}).strict();

export const GmailMsgUpdateManyWithWhereWithoutJobInputSchema: z.ZodType<Prisma.GmailMsgUpdateManyWithWhereWithoutJobInput> = z.object({
  where: z.lazy(() => GmailMsgScalarWhereInputSchema),
  data: z.union([ z.lazy(() => GmailMsgUpdateManyMutationInputSchema),z.lazy(() => GmailMsgUncheckedUpdateManyWithoutGmailMsgsInputSchema) ]),
}).strict();

export const GmailMsgScalarWhereInputSchema: z.ZodType<Prisma.GmailMsgScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GmailMsgScalarWhereInputSchema),z.lazy(() => GmailMsgScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GmailMsgScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GmailMsgScalarWhereInputSchema),z.lazy(() => GmailMsgScalarWhereInputSchema).array() ]).optional(),
  threadId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  inboxMsgId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  jobId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  direction: z.union([ z.lazy(() => EnumEmailDirectionFilterSchema),z.lazy(() => EmailDirectionSchema) ]).optional(),
}).strict();

export const PurchaseOrderUpsertWithoutJobsInputSchema: z.ZodType<Prisma.PurchaseOrderUpsertWithoutJobsInput> = z.object({
  update: z.union([ z.lazy(() => PurchaseOrderUpdateWithoutJobsInputSchema),z.lazy(() => PurchaseOrderUncheckedUpdateWithoutJobsInputSchema) ]),
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutJobsInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutJobsInputSchema) ]),
}).strict();

export const PurchaseOrderUpdateWithoutJobsInputSchema: z.ZodType<Prisma.PurchaseOrderUpdateWithoutJobsInput> = z.object({
  client: z.lazy(() => ClientUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  primaryJob: z.lazy(() => JobUpdateOneWithoutPurchaseOrderNestedInputSchema).optional()
}).strict();

export const PurchaseOrderUncheckedUpdateWithoutJobsInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedUpdateWithoutJobsInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primaryJobId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const VendorUpsertWithoutOrdersInputSchema: z.ZodType<Prisma.VendorUpsertWithoutOrdersInput> = z.object({
  update: z.union([ z.lazy(() => VendorUpdateWithoutOrdersInputSchema),z.lazy(() => VendorUncheckedUpdateWithoutOrdersInputSchema) ]),
  create: z.union([ z.lazy(() => VendorCreateWithoutOrdersInputSchema),z.lazy(() => VendorUncheckedCreateWithoutOrdersInputSchema) ]),
}).strict();

export const VendorUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.VendorUpdateWithoutOrdersInput> = z.object({
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.lazy(() => DepartmentSchema),z.lazy(() => EnumDepartmentFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => VendorStatusSchema),z.lazy(() => EnumVendorStatusFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VendorUncheckedUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.VendorUncheckedUpdateWithoutOrdersInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  department: z.union([ z.lazy(() => DepartmentSchema),z.lazy(() => EnumDepartmentFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => VendorStatusSchema),z.lazy(() => EnumVendorStatusFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PurchaseOrderUpsertWithoutPrimaryJobInputSchema: z.ZodType<Prisma.PurchaseOrderUpsertWithoutPrimaryJobInput> = z.object({
  update: z.union([ z.lazy(() => PurchaseOrderUpdateWithoutPrimaryJobInputSchema),z.lazy(() => PurchaseOrderUncheckedUpdateWithoutPrimaryJobInputSchema) ]),
  create: z.union([ z.lazy(() => PurchaseOrderCreateWithoutPrimaryJobInputSchema),z.lazy(() => PurchaseOrderUncheckedCreateWithoutPrimaryJobInputSchema) ]),
}).strict();

export const PurchaseOrderUpdateWithoutPrimaryJobInputSchema: z.ZodType<Prisma.PurchaseOrderUpdateWithoutPrimaryJobInput> = z.object({
  jobs: z.lazy(() => JobUpdateManyWithoutPurchaseOrderNestedInputSchema).optional(),
  client: z.lazy(() => ClientUpdateOneRequiredWithoutOrdersNestedInputSchema).optional()
}).strict();

export const PurchaseOrderUncheckedUpdateWithoutPrimaryJobInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedUpdateWithoutPrimaryJobInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  jobs: z.lazy(() => JobUncheckedUpdateManyWithoutPurchaseOrderNestedInputSchema).optional()
}).strict();

export const JobCreateWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobCreateWithoutPurchaseOrderInput> = z.object({
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => JobTypeSchema),
  status: z.lazy(() => JobStatusSchema),
  GmailMsgs: z.lazy(() => GmailMsgCreateNestedManyWithoutJobInputSchema).optional(),
  vendor: z.lazy(() => VendorCreateNestedOneWithoutOrdersInputSchema),
  PurchaseOrder: z.lazy(() => PurchaseOrderCreateNestedOneWithoutPrimaryJobInputSchema).optional()
}).strict();

export const JobUncheckedCreateWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobUncheckedCreateWithoutPurchaseOrderInput> = z.object({
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => JobTypeSchema),
  status: z.lazy(() => JobStatusSchema),
  vendorId: z.number(),
  GmailMsgs: z.lazy(() => GmailMsgUncheckedCreateNestedManyWithoutJobInputSchema).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUncheckedCreateNestedOneWithoutPrimaryJobInputSchema).optional()
}).strict();

export const JobCreateOrConnectWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobCreateOrConnectWithoutPurchaseOrderInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema) ]),
}).strict();

export const JobCreateManyPurchaseOrderInputEnvelopeSchema: z.ZodType<Prisma.JobCreateManyPurchaseOrderInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => JobCreateManyPurchaseOrderInputSchema),z.lazy(() => JobCreateManyPurchaseOrderInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ClientCreateWithoutOrdersInputSchema: z.ZodType<Prisma.ClientCreateWithoutOrdersInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  emails: z.lazy(() => ClientEmailCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutClientInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepCreateNestedOneWithoutClientInputSchema),
  company: z.lazy(() => CompanyCreateNestedOneWithoutClientInputSchema),
  clientAddress: z.lazy(() => ClientAddressCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientUncheckedCreateWithoutOrdersInputSchema: z.ZodType<Prisma.ClientUncheckedCreateWithoutOrdersInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  salesRepUsername: z.string(),
  companyId: z.number(),
  emails: z.lazy(() => ClientEmailUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientCreateOrConnectWithoutOrdersInputSchema: z.ZodType<Prisma.ClientCreateOrConnectWithoutOrdersInput> = z.object({
  where: z.lazy(() => ClientWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientCreateWithoutOrdersInputSchema),z.lazy(() => ClientUncheckedCreateWithoutOrdersInputSchema) ]),
}).strict();

export const JobUpsertWithWhereUniqueWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobUpsertWithWhereUniqueWithoutPurchaseOrderInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => JobUpdateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedUpdateWithoutPurchaseOrderInputSchema) ]),
  create: z.union([ z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema) ]),
}).strict();

export const JobUpdateWithWhereUniqueWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobUpdateWithWhereUniqueWithoutPurchaseOrderInput> = z.object({
  where: z.lazy(() => JobWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => JobUpdateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedUpdateWithoutPurchaseOrderInputSchema) ]),
}).strict();

export const JobUpdateManyWithWhereWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobUpdateManyWithWhereWithoutPurchaseOrderInput> = z.object({
  where: z.lazy(() => JobScalarWhereInputSchema),
  data: z.union([ z.lazy(() => JobUpdateManyMutationInputSchema),z.lazy(() => JobUncheckedUpdateManyWithoutJobsInputSchema) ]),
}).strict();

export const ClientUpsertWithoutOrdersInputSchema: z.ZodType<Prisma.ClientUpsertWithoutOrdersInput> = z.object({
  update: z.union([ z.lazy(() => ClientUpdateWithoutOrdersInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutOrdersInputSchema) ]),
  create: z.union([ z.lazy(() => ClientCreateWithoutOrdersInputSchema),z.lazy(() => ClientUncheckedCreateWithoutOrdersInputSchema) ]),
}).strict();

export const ClientUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.ClientUpdateWithoutOrdersInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emails: z.lazy(() => ClientEmailUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutClientNestedInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientUncheckedUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateWithoutOrdersInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRepUsername: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  emails: z.lazy(() => ClientEmailUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const JobUpsertWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobUpsertWithoutPurchaseOrderInput> = z.object({
  update: z.union([ z.lazy(() => JobUpdateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedUpdateWithoutPurchaseOrderInputSchema) ]),
  create: z.union([ z.lazy(() => JobCreateWithoutPurchaseOrderInputSchema),z.lazy(() => JobUncheckedCreateWithoutPurchaseOrderInputSchema) ]),
}).strict();

export const JobUpdateWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobUpdateWithoutPurchaseOrderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
  GmailMsgs: z.lazy(() => GmailMsgUpdateManyWithoutJobNestedInputSchema).optional(),
  vendor: z.lazy(() => VendorUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUpdateOneWithoutPrimaryJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateWithoutPurchaseOrderInputSchema: z.ZodType<Prisma.JobUncheckedUpdateWithoutPurchaseOrderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  GmailMsgs: z.lazy(() => GmailMsgUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUncheckedUpdateOneWithoutPrimaryJobNestedInputSchema).optional()
}).strict();

export const CompanyCreateWithoutSalesRepInputSchema: z.ZodType<Prisma.CompanyCreateWithoutSalesRepInput> = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutCompanyInputSchema).optional(),
  Client: z.lazy(() => ClientCreateNestedManyWithoutCompanyInputSchema).optional()
}).strict();

export const CompanyUncheckedCreateWithoutSalesRepInputSchema: z.ZodType<Prisma.CompanyUncheckedCreateWithoutSalesRepInput> = z.object({
  id: z.number().optional(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutCompanyInputSchema).optional(),
  Client: z.lazy(() => ClientUncheckedCreateNestedManyWithoutCompanyInputSchema).optional()
}).strict();

export const CompanyCreateOrConnectWithoutSalesRepInputSchema: z.ZodType<Prisma.CompanyCreateOrConnectWithoutSalesRepInput> = z.object({
  where: z.lazy(() => CompanyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CompanyCreateWithoutSalesRepInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutSalesRepInputSchema) ]),
}).strict();

export const UserCreateWithoutSalesRepInputSchema: z.ZodType<Prisma.UserCreateWithoutSalesRepInput> = z.object({
  id: z.string(),
  username: z.string(),
  role: z.lazy(() => UserRolesSchema),
  session: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  Key: z.lazy(() => KeyCreateNestedManyWithoutUserInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSalesRepInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSalesRepInput> = z.object({
  id: z.string(),
  username: z.string(),
  role: z.lazy(() => UserRolesSchema),
  session: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Key: z.lazy(() => KeyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSalesRepInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSalesRepInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSalesRepInputSchema),z.lazy(() => UserUncheckedCreateWithoutSalesRepInputSchema) ]),
}).strict();

export const ClientSalesRepCompanyCreateWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateWithoutSalesRepInput> = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
  client: z.lazy(() => ClientCreateNestedOneWithoutClientSalesRepCompanyInputSchema),
  company: z.lazy(() => CompanyCreateNestedOneWithoutClientSalesRepCompanyInputSchema)
}).strict();

export const ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInput> = z.object({
  clientId: z.string(),
  companyId: z.number(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional()
}).strict();

export const ClientSalesRepCompanyCreateOrConnectWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateOrConnectWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInputSchema) ]),
}).strict();

export const ClientSalesRepCompanyCreateManySalesRepInputEnvelopeSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateManySalesRepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ClientSalesRepCompanyCreateManySalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyCreateManySalesRepInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ClientCreateWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientCreateWithoutSalesRepInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  emails: z.lazy(() => ClientEmailCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutClientInputSchema).optional(),
  company: z.lazy(() => CompanyCreateNestedOneWithoutClientInputSchema),
  clientAddress: z.lazy(() => ClientAddressCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientUncheckedCreateWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientUncheckedCreateWithoutSalesRepInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  companyId: z.number(),
  emails: z.lazy(() => ClientEmailUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientCreateOrConnectWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientCreateOrConnectWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ClientWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientCreateWithoutSalesRepInputSchema),z.lazy(() => ClientUncheckedCreateWithoutSalesRepInputSchema) ]),
}).strict();

export const ClientCreateManySalesRepInputEnvelopeSchema: z.ZodType<Prisma.ClientCreateManySalesRepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ClientCreateManySalesRepInputSchema),z.lazy(() => ClientCreateManySalesRepInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ColorSettingsCreateWithoutSalesRepInputSchema: z.ZodType<Prisma.ColorSettingsCreateWithoutSalesRepInput> = z.object({
  accentColor: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  auxiliaryColor: z.string(),
  theme: z.lazy(() => ThemeSchema)
}).strict();

export const ColorSettingsUncheckedCreateWithoutSalesRepInputSchema: z.ZodType<Prisma.ColorSettingsUncheckedCreateWithoutSalesRepInput> = z.object({
  accentColor: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  auxiliaryColor: z.string(),
  theme: z.lazy(() => ThemeSchema)
}).strict();

export const ColorSettingsCreateOrConnectWithoutSalesRepInputSchema: z.ZodType<Prisma.ColorSettingsCreateOrConnectWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ColorSettingsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ColorSettingsCreateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUncheckedCreateWithoutSalesRepInputSchema) ]),
}).strict();

export const ColorSettingsCreateManySalesRepInputEnvelopeSchema: z.ZodType<Prisma.ColorSettingsCreateManySalesRepInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ColorSettingsCreateManySalesRepInputSchema),z.lazy(() => ColorSettingsCreateManySalesRepInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CompanyUpsertWithoutSalesRepInputSchema: z.ZodType<Prisma.CompanyUpsertWithoutSalesRepInput> = z.object({
  update: z.union([ z.lazy(() => CompanyUpdateWithoutSalesRepInputSchema),z.lazy(() => CompanyUncheckedUpdateWithoutSalesRepInputSchema) ]),
  create: z.union([ z.lazy(() => CompanyCreateWithoutSalesRepInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutSalesRepInputSchema) ]),
}).strict();

export const CompanyUpdateWithoutSalesRepInputSchema: z.ZodType<Prisma.CompanyUpdateWithoutSalesRepInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  website: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutCompanyNestedInputSchema).optional(),
  Client: z.lazy(() => ClientUpdateManyWithoutCompanyNestedInputSchema).optional()
}).strict();

export const CompanyUncheckedUpdateWithoutSalesRepInputSchema: z.ZodType<Prisma.CompanyUncheckedUpdateWithoutSalesRepInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  website: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ClientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional(),
  Client: z.lazy(() => ClientUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutSalesRepInputSchema: z.ZodType<Prisma.UserUpsertWithoutSalesRepInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSalesRepInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSalesRepInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSalesRepInputSchema),z.lazy(() => UserUncheckedCreateWithoutSalesRepInputSchema) ]),
}).strict();

export const UserUpdateWithoutSalesRepInputSchema: z.ZodType<Prisma.UserUpdateWithoutSalesRepInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
  session: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  Key: z.lazy(() => KeyUpdateManyWithoutUserNestedInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSalesRepInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSalesRepInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
  session: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Key: z.lazy(() => KeyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ClientSalesRepCompanyUpsertWithWhereUniqueWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpsertWithWhereUniqueWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedUpdateWithoutSalesRepInputSchema) ]),
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutSalesRepInputSchema) ]),
}).strict();

export const ClientSalesRepCompanyUpdateWithWhereUniqueWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateWithWhereUniqueWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithoutSalesRepInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedUpdateWithoutSalesRepInputSchema) ]),
}).strict();

export const ClientSalesRepCompanyUpdateManyWithWhereWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateManyWithWhereWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateManyMutationInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutClientSalesRepCompanyInputSchema) ]),
}).strict();

export const ClientUpsertWithWhereUniqueWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientUpsertWithWhereUniqueWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ClientWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClientUpdateWithoutSalesRepInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutSalesRepInputSchema) ]),
  create: z.union([ z.lazy(() => ClientCreateWithoutSalesRepInputSchema),z.lazy(() => ClientUncheckedCreateWithoutSalesRepInputSchema) ]),
}).strict();

export const ClientUpdateWithWhereUniqueWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientUpdateWithWhereUniqueWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ClientWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClientUpdateWithoutSalesRepInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutSalesRepInputSchema) ]),
}).strict();

export const ClientUpdateManyWithWhereWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientUpdateManyWithWhereWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ClientScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClientUpdateManyMutationInputSchema),z.lazy(() => ClientUncheckedUpdateManyWithoutClientInputSchema) ]),
}).strict();

export const ClientScalarWhereInputSchema: z.ZodType<Prisma.ClientScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClientScalarWhereInputSchema),z.lazy(() => ClientScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClientScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClientScalarWhereInputSchema),z.lazy(() => ClientScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  companyName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  addTransactionCharges: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  payMethod: z.union([ z.lazy(() => EnumPayMethodFilterSchema),z.lazy(() => PayMethodSchema) ]).optional(),
  currency: z.union([ z.lazy(() => EnumCurrencyFilterSchema),z.lazy(() => CurrencySchema) ]).optional(),
  status: z.union([ z.lazy(() => EnumClientStatusFilterSchema),z.lazy(() => ClientStatusSchema) ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  salesRepUsername: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  companyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const ColorSettingsUpsertWithWhereUniqueWithoutSalesRepInputSchema: z.ZodType<Prisma.ColorSettingsUpsertWithWhereUniqueWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ColorSettingsWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ColorSettingsUpdateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUncheckedUpdateWithoutSalesRepInputSchema) ]),
  create: z.union([ z.lazy(() => ColorSettingsCreateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUncheckedCreateWithoutSalesRepInputSchema) ]),
}).strict();

export const ColorSettingsUpdateWithWhereUniqueWithoutSalesRepInputSchema: z.ZodType<Prisma.ColorSettingsUpdateWithWhereUniqueWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ColorSettingsWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ColorSettingsUpdateWithoutSalesRepInputSchema),z.lazy(() => ColorSettingsUncheckedUpdateWithoutSalesRepInputSchema) ]),
}).strict();

export const ColorSettingsUpdateManyWithWhereWithoutSalesRepInputSchema: z.ZodType<Prisma.ColorSettingsUpdateManyWithWhereWithoutSalesRepInput> = z.object({
  where: z.lazy(() => ColorSettingsScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ColorSettingsUpdateManyMutationInputSchema),z.lazy(() => ColorSettingsUncheckedUpdateManyWithoutSalesRepColorsInputSchema) ]),
}).strict();

export const ColorSettingsScalarWhereInputSchema: z.ZodType<Prisma.ColorSettingsScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ColorSettingsScalarWhereInputSchema),z.lazy(() => ColorSettingsScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ColorSettingsScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ColorSettingsScalarWhereInputSchema),z.lazy(() => ColorSettingsScalarWhereInputSchema).array() ]).optional(),
  salesRepUsername: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accentColor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  primaryColor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  secondaryColor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  auxiliaryColor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  theme: z.union([ z.lazy(() => EnumThemeFilterSchema),z.lazy(() => ThemeSchema) ]).optional(),
}).strict();

export const SalesRepCreateWithoutSalesRepColorsInputSchema: z.ZodType<Prisma.SalesRepCreateWithoutSalesRepColorsInput> = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  company: z.lazy(() => CompanyCreateNestedOneWithoutSalesRepInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutSalesRepInputSchema),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutSalesRepInputSchema).optional(),
  client: z.lazy(() => ClientCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepUncheckedCreateWithoutSalesRepColorsInputSchema: z.ZodType<Prisma.SalesRepUncheckedCreateWithoutSalesRepColorsInput> = z.object({
  id: z.number().optional(),
  username: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  companyId: z.number(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional(),
  client: z.lazy(() => ClientUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepCreateOrConnectWithoutSalesRepColorsInputSchema: z.ZodType<Prisma.SalesRepCreateOrConnectWithoutSalesRepColorsInput> = z.object({
  where: z.lazy(() => SalesRepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SalesRepCreateWithoutSalesRepColorsInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutSalesRepColorsInputSchema) ]),
}).strict();

export const SalesRepUpsertWithoutSalesRepColorsInputSchema: z.ZodType<Prisma.SalesRepUpsertWithoutSalesRepColorsInput> = z.object({
  update: z.union([ z.lazy(() => SalesRepUpdateWithoutSalesRepColorsInputSchema),z.lazy(() => SalesRepUncheckedUpdateWithoutSalesRepColorsInputSchema) ]),
  create: z.union([ z.lazy(() => SalesRepCreateWithoutSalesRepColorsInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutSalesRepColorsInputSchema) ]),
}).strict();

export const SalesRepUpdateWithoutSalesRepColorsInputSchema: z.ZodType<Prisma.SalesRepUpdateWithoutSalesRepColorsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutSalesRepNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSalesRepNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  client: z.lazy(() => ClientUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const SalesRepUncheckedUpdateWithoutSalesRepColorsInputSchema: z.ZodType<Prisma.SalesRepUncheckedUpdateWithoutSalesRepColorsInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  client: z.lazy(() => ClientUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutUserSettingsInputSchema: z.ZodType<Prisma.UserCreateWithoutUserSettingsInput> = z.object({
  id: z.string(),
  username: z.string(),
  role: z.lazy(() => UserRolesSchema),
  session: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  Key: z.lazy(() => KeyCreateNestedManyWithoutUserInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutUserSettingsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutUserSettingsInput> = z.object({
  id: z.string(),
  username: z.string(),
  role: z.lazy(() => UserRolesSchema),
  session: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Key: z.lazy(() => KeyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUncheckedCreateNestedOneWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutUserSettingsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutUserSettingsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutUserSettingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserSettingsInputSchema) ]),
}).strict();

export const UserUpsertWithoutUserSettingsInputSchema: z.ZodType<Prisma.UserUpsertWithoutUserSettingsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutUserSettingsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserSettingsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutUserSettingsInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserSettingsInputSchema) ]),
}).strict();

export const UserUpdateWithoutUserSettingsInputSchema: z.ZodType<Prisma.UserUpdateWithoutUserSettingsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
  session: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  Key: z.lazy(() => KeyUpdateManyWithoutUserNestedInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutUserSettingsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutUserSettingsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
  session: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Key: z.lazy(() => KeyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUncheckedUpdateOneWithoutUserNestedInputSchema).optional()
}).strict();

export const ClientCreateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.ClientCreateWithoutClientSalesRepCompanyInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  emails: z.lazy(() => ClientEmailCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderCreateNestedManyWithoutClientInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepCreateNestedOneWithoutClientInputSchema),
  company: z.lazy(() => CompanyCreateNestedOneWithoutClientInputSchema),
  clientAddress: z.lazy(() => ClientAddressCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientUncheckedCreateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.ClientUncheckedCreateWithoutClientSalesRepCompanyInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  salesRepUsername: z.string(),
  companyId: z.number(),
  emails: z.lazy(() => ClientEmailUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientCreateOrConnectWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.ClientCreateOrConnectWithoutClientSalesRepCompanyInput> = z.object({
  where: z.lazy(() => ClientWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => ClientUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]),
}).strict();

export const SalesRepCreateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.SalesRepCreateWithoutClientSalesRepCompanyInput> = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  company: z.lazy(() => CompanyCreateNestedOneWithoutSalesRepInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutSalesRepInputSchema),
  client: z.lazy(() => ClientCreateNestedManyWithoutSalesRepInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepUncheckedCreateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.SalesRepUncheckedCreateWithoutClientSalesRepCompanyInput> = z.object({
  id: z.number().optional(),
  username: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  companyId: z.number(),
  client: z.lazy(() => ClientUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepCreateOrConnectWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.SalesRepCreateOrConnectWithoutClientSalesRepCompanyInput> = z.object({
  where: z.lazy(() => SalesRepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SalesRepCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]),
}).strict();

export const CompanyCreateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.CompanyCreateWithoutClientSalesRepCompanyInput> = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  SalesRep: z.lazy(() => SalesRepCreateNestedManyWithoutCompanyInputSchema).optional(),
  Client: z.lazy(() => ClientCreateNestedManyWithoutCompanyInputSchema).optional()
}).strict();

export const CompanyUncheckedCreateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.CompanyUncheckedCreateWithoutClientSalesRepCompanyInput> = z.object({
  id: z.number().optional(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  phone: z.string(),
  email: z.string(),
  website: z.string(),
  SalesRep: z.lazy(() => SalesRepUncheckedCreateNestedManyWithoutCompanyInputSchema).optional(),
  Client: z.lazy(() => ClientUncheckedCreateNestedManyWithoutCompanyInputSchema).optional()
}).strict();

export const CompanyCreateOrConnectWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.CompanyCreateOrConnectWithoutClientSalesRepCompanyInput> = z.object({
  where: z.lazy(() => CompanyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CompanyCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]),
}).strict();

export const ClientUpsertWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.ClientUpsertWithoutClientSalesRepCompanyInput> = z.object({
  update: z.union([ z.lazy(() => ClientUpdateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutClientSalesRepCompanyInputSchema) ]),
  create: z.union([ z.lazy(() => ClientCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => ClientUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]),
}).strict();

export const ClientUpdateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.ClientUpdateWithoutClientSalesRepCompanyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emails: z.lazy(() => ClientEmailUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUpdateManyWithoutClientNestedInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientUncheckedUpdateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateWithoutClientSalesRepCompanyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRepUsername: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  emails: z.lazy(() => ClientEmailUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const SalesRepUpsertWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.SalesRepUpsertWithoutClientSalesRepCompanyInput> = z.object({
  update: z.union([ z.lazy(() => SalesRepUpdateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => SalesRepUncheckedUpdateWithoutClientSalesRepCompanyInputSchema) ]),
  create: z.union([ z.lazy(() => SalesRepCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]),
}).strict();

export const SalesRepUpdateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.SalesRepUpdateWithoutClientSalesRepCompanyInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutSalesRepNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSalesRepNestedInputSchema).optional(),
  client: z.lazy(() => ClientUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const SalesRepUncheckedUpdateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.SalesRepUncheckedUpdateWithoutClientSalesRepCompanyInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  client: z.lazy(() => ClientUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const CompanyUpsertWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.CompanyUpsertWithoutClientSalesRepCompanyInput> = z.object({
  update: z.union([ z.lazy(() => CompanyUpdateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => CompanyUncheckedUpdateWithoutClientSalesRepCompanyInputSchema) ]),
  create: z.union([ z.lazy(() => CompanyCreateWithoutClientSalesRepCompanyInputSchema),z.lazy(() => CompanyUncheckedCreateWithoutClientSalesRepCompanyInputSchema) ]),
}).strict();

export const CompanyUpdateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.CompanyUpdateWithoutClientSalesRepCompanyInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  website: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  SalesRep: z.lazy(() => SalesRepUpdateManyWithoutCompanyNestedInputSchema).optional(),
  Client: z.lazy(() => ClientUpdateManyWithoutCompanyNestedInputSchema).optional()
}).strict();

export const CompanyUncheckedUpdateWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.CompanyUncheckedUpdateWithoutClientSalesRepCompanyInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  zip: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  website: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  SalesRep: z.lazy(() => SalesRepUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional(),
  Client: z.lazy(() => ClientUncheckedUpdateManyWithoutCompanyNestedInputSchema).optional()
}).strict();

export const ClientCreateWithoutClientAddressInputSchema: z.ZodType<Prisma.ClientCreateWithoutClientAddressInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  emails: z.lazy(() => ClientEmailCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutClientInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepCreateNestedOneWithoutClientInputSchema),
  company: z.lazy(() => CompanyCreateNestedOneWithoutClientInputSchema)
}).strict();

export const ClientUncheckedCreateWithoutClientAddressInputSchema: z.ZodType<Prisma.ClientUncheckedCreateWithoutClientAddressInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  salesRepUsername: z.string(),
  companyId: z.number(),
  emails: z.lazy(() => ClientEmailUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutClientInputSchema).optional()
}).strict();

export const ClientCreateOrConnectWithoutClientAddressInputSchema: z.ZodType<Prisma.ClientCreateOrConnectWithoutClientAddressInput> = z.object({
  where: z.lazy(() => ClientWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientCreateWithoutClientAddressInputSchema),z.lazy(() => ClientUncheckedCreateWithoutClientAddressInputSchema) ]),
}).strict();

export const ClientUpsertWithoutClientAddressInputSchema: z.ZodType<Prisma.ClientUpsertWithoutClientAddressInput> = z.object({
  update: z.union([ z.lazy(() => ClientUpdateWithoutClientAddressInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutClientAddressInputSchema) ]),
  create: z.union([ z.lazy(() => ClientCreateWithoutClientAddressInputSchema),z.lazy(() => ClientUncheckedCreateWithoutClientAddressInputSchema) ]),
}).strict();

export const ClientUpdateWithoutClientAddressInputSchema: z.ZodType<Prisma.ClientUpdateWithoutClientAddressInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emails: z.lazy(() => ClientEmailUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutClientNestedInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientUncheckedUpdateWithoutClientAddressInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateWithoutClientAddressInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRepUsername: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  emails: z.lazy(() => ClientEmailUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientCreateWithoutEmailsInputSchema: z.ZodType<Prisma.ClientCreateWithoutEmailsInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  phones: z.lazy(() => ClientPhoneCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutClientInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepCreateNestedOneWithoutClientInputSchema),
  company: z.lazy(() => CompanyCreateNestedOneWithoutClientInputSchema),
  clientAddress: z.lazy(() => ClientAddressCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientUncheckedCreateWithoutEmailsInputSchema: z.ZodType<Prisma.ClientUncheckedCreateWithoutEmailsInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  salesRepUsername: z.string(),
  companyId: z.number(),
  phones: z.lazy(() => ClientPhoneUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientCreateOrConnectWithoutEmailsInputSchema: z.ZodType<Prisma.ClientCreateOrConnectWithoutEmailsInput> = z.object({
  where: z.lazy(() => ClientWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientCreateWithoutEmailsInputSchema),z.lazy(() => ClientUncheckedCreateWithoutEmailsInputSchema) ]),
}).strict();

export const ClientUpsertWithoutEmailsInputSchema: z.ZodType<Prisma.ClientUpsertWithoutEmailsInput> = z.object({
  update: z.union([ z.lazy(() => ClientUpdateWithoutEmailsInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutEmailsInputSchema) ]),
  create: z.union([ z.lazy(() => ClientCreateWithoutEmailsInputSchema),z.lazy(() => ClientUncheckedCreateWithoutEmailsInputSchema) ]),
}).strict();

export const ClientUpdateWithoutEmailsInputSchema: z.ZodType<Prisma.ClientUpdateWithoutEmailsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phones: z.lazy(() => ClientPhoneUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutClientNestedInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientUncheckedUpdateWithoutEmailsInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateWithoutEmailsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRepUsername: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientCreateWithoutPhonesInputSchema: z.ZodType<Prisma.ClientCreateWithoutPhonesInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  emails: z.lazy(() => ClientEmailCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutClientInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepCreateNestedOneWithoutClientInputSchema),
  company: z.lazy(() => CompanyCreateNestedOneWithoutClientInputSchema),
  clientAddress: z.lazy(() => ClientAddressCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientUncheckedCreateWithoutPhonesInputSchema: z.ZodType<Prisma.ClientUncheckedCreateWithoutPhonesInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  salesRepUsername: z.string(),
  companyId: z.number(),
  emails: z.lazy(() => ClientEmailUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientCreateOrConnectWithoutPhonesInputSchema: z.ZodType<Prisma.ClientCreateOrConnectWithoutPhonesInput> = z.object({
  where: z.lazy(() => ClientWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientCreateWithoutPhonesInputSchema),z.lazy(() => ClientUncheckedCreateWithoutPhonesInputSchema) ]),
}).strict();

export const ClientUpsertWithoutPhonesInputSchema: z.ZodType<Prisma.ClientUpsertWithoutPhonesInput> = z.object({
  update: z.union([ z.lazy(() => ClientUpdateWithoutPhonesInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutPhonesInputSchema) ]),
  create: z.union([ z.lazy(() => ClientCreateWithoutPhonesInputSchema),z.lazy(() => ClientUncheckedCreateWithoutPhonesInputSchema) ]),
}).strict();

export const ClientUpdateWithoutPhonesInputSchema: z.ZodType<Prisma.ClientUpdateWithoutPhonesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emails: z.lazy(() => ClientEmailUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutClientNestedInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientUncheckedUpdateWithoutPhonesInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateWithoutPhonesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRepUsername: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  emails: z.lazy(() => ClientEmailUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const SalesRepCreateWithoutCompanyInputSchema: z.ZodType<Prisma.SalesRepCreateWithoutCompanyInput> = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutSalesRepInputSchema),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutSalesRepInputSchema).optional(),
  client: z.lazy(() => ClientCreateNestedManyWithoutSalesRepInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepUncheckedCreateWithoutCompanyInputSchema: z.ZodType<Prisma.SalesRepUncheckedCreateWithoutCompanyInput> = z.object({
  id: z.number().optional(),
  username: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional(),
  client: z.lazy(() => ClientUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepCreateOrConnectWithoutCompanyInputSchema: z.ZodType<Prisma.SalesRepCreateOrConnectWithoutCompanyInput> = z.object({
  where: z.lazy(() => SalesRepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SalesRepCreateWithoutCompanyInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutCompanyInputSchema) ]),
}).strict();

export const SalesRepCreateManyCompanyInputEnvelopeSchema: z.ZodType<Prisma.SalesRepCreateManyCompanyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SalesRepCreateManyCompanyInputSchema),z.lazy(() => SalesRepCreateManyCompanyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ClientSalesRepCompanyCreateWithoutCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateWithoutCompanyInput> = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
  client: z.lazy(() => ClientCreateNestedOneWithoutClientSalesRepCompanyInputSchema),
  salesRep: z.lazy(() => SalesRepCreateNestedOneWithoutClientSalesRepCompanyInputSchema)
}).strict();

export const ClientSalesRepCompanyUncheckedCreateWithoutCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedCreateWithoutCompanyInput> = z.object({
  clientId: z.string(),
  salesRepUsername: z.string(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional()
}).strict();

export const ClientSalesRepCompanyCreateOrConnectWithoutCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateOrConnectWithoutCompanyInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutCompanyInputSchema) ]),
}).strict();

export const ClientSalesRepCompanyCreateManyCompanyInputEnvelopeSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateManyCompanyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ClientSalesRepCompanyCreateManyCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyCreateManyCompanyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ClientCreateWithoutCompanyInputSchema: z.ZodType<Prisma.ClientCreateWithoutCompanyInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  emails: z.lazy(() => ClientEmailCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutClientInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepCreateNestedOneWithoutClientInputSchema),
  clientAddress: z.lazy(() => ClientAddressCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientUncheckedCreateWithoutCompanyInputSchema: z.ZodType<Prisma.ClientUncheckedCreateWithoutCompanyInput> = z.object({
  id: z.string(),
  name: z.string(),
  companyName: z.string(),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  salesRepUsername: z.string(),
  emails: z.lazy(() => ClientEmailUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutClientInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedCreateNestedOneWithoutClientInputSchema).optional()
}).strict();

export const ClientCreateOrConnectWithoutCompanyInputSchema: z.ZodType<Prisma.ClientCreateOrConnectWithoutCompanyInput> = z.object({
  where: z.lazy(() => ClientWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClientCreateWithoutCompanyInputSchema),z.lazy(() => ClientUncheckedCreateWithoutCompanyInputSchema) ]),
}).strict();

export const ClientCreateManyCompanyInputEnvelopeSchema: z.ZodType<Prisma.ClientCreateManyCompanyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ClientCreateManyCompanyInputSchema),z.lazy(() => ClientCreateManyCompanyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SalesRepUpsertWithWhereUniqueWithoutCompanyInputSchema: z.ZodType<Prisma.SalesRepUpsertWithWhereUniqueWithoutCompanyInput> = z.object({
  where: z.lazy(() => SalesRepWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SalesRepUpdateWithoutCompanyInputSchema),z.lazy(() => SalesRepUncheckedUpdateWithoutCompanyInputSchema) ]),
  create: z.union([ z.lazy(() => SalesRepCreateWithoutCompanyInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutCompanyInputSchema) ]),
}).strict();

export const SalesRepUpdateWithWhereUniqueWithoutCompanyInputSchema: z.ZodType<Prisma.SalesRepUpdateWithWhereUniqueWithoutCompanyInput> = z.object({
  where: z.lazy(() => SalesRepWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SalesRepUpdateWithoutCompanyInputSchema),z.lazy(() => SalesRepUncheckedUpdateWithoutCompanyInputSchema) ]),
}).strict();

export const SalesRepUpdateManyWithWhereWithoutCompanyInputSchema: z.ZodType<Prisma.SalesRepUpdateManyWithWhereWithoutCompanyInput> = z.object({
  where: z.lazy(() => SalesRepScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SalesRepUpdateManyMutationInputSchema),z.lazy(() => SalesRepUncheckedUpdateManyWithoutSalesRepInputSchema) ]),
}).strict();

export const SalesRepScalarWhereInputSchema: z.ZodType<Prisma.SalesRepScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SalesRepScalarWhereInputSchema),z.lazy(() => SalesRepScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SalesRepScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SalesRepScalarWhereInputSchema),z.lazy(() => SalesRepScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  companyId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const ClientSalesRepCompanyUpsertWithWhereUniqueWithoutCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpsertWithWhereUniqueWithoutCompanyInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedUpdateWithoutCompanyInputSchema) ]),
  create: z.union([ z.lazy(() => ClientSalesRepCompanyCreateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedCreateWithoutCompanyInputSchema) ]),
}).strict();

export const ClientSalesRepCompanyUpdateWithWhereUniqueWithoutCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateWithWhereUniqueWithoutCompanyInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateWithoutCompanyInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedUpdateWithoutCompanyInputSchema) ]),
}).strict();

export const ClientSalesRepCompanyUpdateManyWithWhereWithoutCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateManyWithWhereWithoutCompanyInput> = z.object({
  where: z.lazy(() => ClientSalesRepCompanyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClientSalesRepCompanyUpdateManyMutationInputSchema),z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutClientSalesRepCompanyInputSchema) ]),
}).strict();

export const ClientUpsertWithWhereUniqueWithoutCompanyInputSchema: z.ZodType<Prisma.ClientUpsertWithWhereUniqueWithoutCompanyInput> = z.object({
  where: z.lazy(() => ClientWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClientUpdateWithoutCompanyInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutCompanyInputSchema) ]),
  create: z.union([ z.lazy(() => ClientCreateWithoutCompanyInputSchema),z.lazy(() => ClientUncheckedCreateWithoutCompanyInputSchema) ]),
}).strict();

export const ClientUpdateWithWhereUniqueWithoutCompanyInputSchema: z.ZodType<Prisma.ClientUpdateWithWhereUniqueWithoutCompanyInput> = z.object({
  where: z.lazy(() => ClientWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClientUpdateWithoutCompanyInputSchema),z.lazy(() => ClientUncheckedUpdateWithoutCompanyInputSchema) ]),
}).strict();

export const ClientUpdateManyWithWhereWithoutCompanyInputSchema: z.ZodType<Prisma.ClientUpdateManyWithWhereWithoutCompanyInput> = z.object({
  where: z.lazy(() => ClientScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClientUpdateManyMutationInputSchema),z.lazy(() => ClientUncheckedUpdateManyWithoutClientInputSchema) ]),
}).strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.object({
  id: z.string(),
  active_expires: z.bigint(),
  idle_expires: z.bigint()
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  active_expires: z.bigint(),
  idle_expires: z.bigint()
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema),z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const KeyCreateWithoutUserInputSchema: z.ZodType<Prisma.KeyCreateWithoutUserInput> = z.object({
  id: z.string(),
  hashed_password: z.string().optional().nullable(),
  primary: z.boolean(),
  expires: z.bigint().optional().nullable()
}).strict();

export const KeyUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.KeyUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  hashed_password: z.string().optional().nullable(),
  primary: z.boolean(),
  expires: z.bigint().optional().nullable()
}).strict();

export const KeyCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.KeyCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => KeyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => KeyCreateWithoutUserInputSchema),z.lazy(() => KeyUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const KeyCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.KeyCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => KeyCreateManyUserInputSchema),z.lazy(() => KeyCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SalesRepCreateWithoutUserInputSchema: z.ZodType<Prisma.SalesRepCreateWithoutUserInput> = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  company: z.lazy(() => CompanyCreateNestedOneWithoutSalesRepInputSchema),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyCreateNestedManyWithoutSalesRepInputSchema).optional(),
  client: z.lazy(() => ClientCreateNestedManyWithoutSalesRepInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SalesRepUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  companyId: z.number(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional(),
  client: z.lazy(() => ClientUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUncheckedCreateNestedManyWithoutSalesRepInputSchema).optional()
}).strict();

export const SalesRepCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SalesRepCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SalesRepWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SalesRepCreateWithoutUserInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserSettingsCreateWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsCreateWithoutUserInput> = z.object({
  settings: z.string()
}).strict();

export const UserSettingsUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUncheckedCreateWithoutUserInput> = z.object({
  settings: z.string()
}).strict();

export const UserSettingsCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => UserSettingsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema),z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserSettingsCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.UserSettingsCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserSettingsCreateManyUserInputSchema),z.lazy(() => UserSettingsCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema),z.lazy(() => SessionUncheckedUpdateManyWithoutSessionInputSchema) ]),
}).strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active_expires: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  idle_expires: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict();

export const KeyUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.KeyUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => KeyWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => KeyUpdateWithoutUserInputSchema),z.lazy(() => KeyUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => KeyCreateWithoutUserInputSchema),z.lazy(() => KeyUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const KeyUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.KeyUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => KeyWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => KeyUpdateWithoutUserInputSchema),z.lazy(() => KeyUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const KeyUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.KeyUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => KeyScalarWhereInputSchema),
  data: z.union([ z.lazy(() => KeyUpdateManyMutationInputSchema),z.lazy(() => KeyUncheckedUpdateManyWithoutKeyInputSchema) ]),
}).strict();

export const KeyScalarWhereInputSchema: z.ZodType<Prisma.KeyScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => KeyScalarWhereInputSchema),z.lazy(() => KeyScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => KeyScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KeyScalarWhereInputSchema),z.lazy(() => KeyScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  hashed_password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  primary: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  expires: z.union([ z.lazy(() => BigIntNullableFilterSchema),z.bigint() ]).optional().nullable(),
}).strict();

export const SalesRepUpsertWithoutUserInputSchema: z.ZodType<Prisma.SalesRepUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => SalesRepUpdateWithoutUserInputSchema),z.lazy(() => SalesRepUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SalesRepCreateWithoutUserInputSchema),z.lazy(() => SalesRepUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SalesRepUpdateWithoutUserInputSchema: z.ZodType<Prisma.SalesRepUpdateWithoutUserInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutSalesRepNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  client: z.lazy(() => ClientUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const SalesRepUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SalesRepUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  client: z.lazy(() => ClientUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const UserSettingsUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserSettingsWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserSettingsUpdateWithoutUserInputSchema),z.lazy(() => UserSettingsUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema),z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserSettingsUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserSettingsWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserSettingsUpdateWithoutUserInputSchema),z.lazy(() => UserSettingsUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const UserSettingsUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => UserSettingsScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserSettingsUpdateManyMutationInputSchema),z.lazy(() => UserSettingsUncheckedUpdateManyWithoutUserSettingsInputSchema) ]),
}).strict();

export const UserSettingsScalarWhereInputSchema: z.ZodType<Prisma.UserSettingsScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserSettingsScalarWhereInputSchema),z.lazy(() => UserSettingsScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserSettingsScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserSettingsScalarWhereInputSchema),z.lazy(() => UserSettingsScalarWhereInputSchema).array() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  settings: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const UserCreateWithoutSessionInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionInput> = z.object({
  id: z.string(),
  username: z.string(),
  role: z.lazy(() => UserRolesSchema),
  Key: z.lazy(() => KeyCreateNestedManyWithoutUserInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepCreateNestedOneWithoutUserInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSessionInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionInput> = z.object({
  id: z.string(),
  username: z.string(),
  role: z.lazy(() => UserRolesSchema),
  Key: z.lazy(() => KeyUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSessionInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionInputSchema) ]),
}).strict();

export const UserUpsertWithoutSessionInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionInputSchema) ]),
}).strict();

export const UserUpdateWithoutSessionInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
  Key: z.lazy(() => KeyUpdateManyWithoutUserNestedInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUpdateOneWithoutUserNestedInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSessionInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
  Key: z.lazy(() => KeyUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutKeyInputSchema: z.ZodType<Prisma.UserCreateWithoutKeyInput> = z.object({
  id: z.string(),
  username: z.string(),
  role: z.lazy(() => UserRolesSchema),
  session: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepCreateNestedOneWithoutUserInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutKeyInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutKeyInput> = z.object({
  id: z.string(),
  username: z.string(),
  role: z.lazy(() => UserRolesSchema),
  session: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutKeyInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutKeyInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutKeyInputSchema),z.lazy(() => UserUncheckedCreateWithoutKeyInputSchema) ]),
}).strict();

export const UserUpsertWithoutKeyInputSchema: z.ZodType<Prisma.UserUpsertWithoutKeyInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutKeyInputSchema),z.lazy(() => UserUncheckedUpdateWithoutKeyInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutKeyInputSchema),z.lazy(() => UserUncheckedCreateWithoutKeyInputSchema) ]),
}).strict();

export const UserUpdateWithoutKeyInputSchema: z.ZodType<Prisma.UserUpdateWithoutKeyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
  session: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUpdateOneWithoutUserNestedInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutKeyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutKeyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRolesSchema),z.lazy(() => EnumUserRolesFieldUpdateOperationsInputSchema) ]).optional(),
  session: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  SalesRep: z.lazy(() => SalesRepUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  UserSettings: z.lazy(() => UserSettingsUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ClientEmailCreateManyClientInputSchema: z.ZodType<Prisma.ClientEmailCreateManyClientInput> = z.object({
  email: z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),
  description: z.string().optional().nullable(),
  type: z.lazy(() => EmailTypeSchema),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ClientPhoneCreateManyClientInputSchema: z.ZodType<Prisma.ClientPhoneCreateManyClientInput> = z.object({
  phone: z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),
  description: z.string().optional().nullable(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => PhoneTypeSchema)
}).strict();

export const PurchaseOrderCreateManyClientInputSchema: z.ZodType<Prisma.PurchaseOrderCreateManyClientInput> = z.object({
  id: z.number().int().optional(),
  primaryJobId: z.string().optional().nullable()
}).strict();

export const ClientSalesRepCompanyCreateManyClientInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateManyClientInput> = z.object({
  salesRepUsername: z.string(),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' }),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional()
}).strict();

export const ClientEmailUpdateWithoutClientInputSchema: z.ZodType<Prisma.ClientEmailUpdateWithoutClientInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EmailTypeSchema),z.lazy(() => EnumEmailTypeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientEmailUncheckedUpdateWithoutClientInputSchema: z.ZodType<Prisma.ClientEmailUncheckedUpdateWithoutClientInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EmailTypeSchema),z.lazy(() => EnumEmailTypeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientEmailUncheckedUpdateManyWithoutEmailsInputSchema: z.ZodType<Prisma.ClientEmailUncheckedUpdateManyWithoutEmailsInput> = z.object({
  email: z.union([ z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => EmailTypeSchema),z.lazy(() => EnumEmailTypeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientPhoneUpdateWithoutClientInputSchema: z.ZodType<Prisma.ClientPhoneUpdateWithoutClientInput> = z.object({
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PhoneTypeSchema),z.lazy(() => EnumPhoneTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientPhoneUncheckedUpdateWithoutClientInputSchema: z.ZodType<Prisma.ClientPhoneUncheckedUpdateWithoutClientInput> = z.object({
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PhoneTypeSchema),z.lazy(() => EnumPhoneTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientPhoneUncheckedUpdateManyWithoutPhonesInputSchema: z.ZodType<Prisma.ClientPhoneUncheckedUpdateManyWithoutPhonesInput> = z.object({
  phone: z.union([ z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PhoneTypeSchema),z.lazy(() => EnumPhoneTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PurchaseOrderUpdateWithoutClientInputSchema: z.ZodType<Prisma.PurchaseOrderUpdateWithoutClientInput> = z.object({
  jobs: z.lazy(() => JobUpdateManyWithoutPurchaseOrderNestedInputSchema).optional(),
  primaryJob: z.lazy(() => JobUpdateOneWithoutPurchaseOrderNestedInputSchema).optional()
}).strict();

export const PurchaseOrderUncheckedUpdateWithoutClientInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedUpdateWithoutClientInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  primaryJobId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  jobs: z.lazy(() => JobUncheckedUpdateManyWithoutPurchaseOrderNestedInputSchema).optional()
}).strict();

export const PurchaseOrderUncheckedUpdateManyWithoutOrdersInputSchema: z.ZodType<Prisma.PurchaseOrderUncheckedUpdateManyWithoutOrdersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  primaryJobId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClientSalesRepCompanyUpdateWithoutClientInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateWithoutClientInput> = z.object({
  fromDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  toDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  salesRep: z.lazy(() => SalesRepUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema).optional()
}).strict();

export const ClientSalesRepCompanyUncheckedUpdateWithoutClientInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedUpdateWithoutClientInput> = z.object({
  salesRepUsername: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  toDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientSalesRepCompanyUncheckedUpdateManyWithoutClientSalesRepCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedUpdateManyWithoutClientSalesRepCompanyInput> = z.object({
  salesRepUsername: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.coerce.number().gte(1, { message: 'Please select a valid company' }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  toDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobCreateManyVendorInputSchema: z.ZodType<Prisma.JobCreateManyVendorInput> = z.object({
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => JobTypeSchema),
  status: z.lazy(() => JobStatusSchema),
  purchaseOrderId: z.number().int()
}).strict();

export const JobUpdateWithoutVendorInputSchema: z.ZodType<Prisma.JobUpdateWithoutVendorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
  GmailMsgs: z.lazy(() => GmailMsgUpdateManyWithoutJobNestedInputSchema).optional(),
  purchaseOrder: z.lazy(() => PurchaseOrderUpdateOneRequiredWithoutJobsNestedInputSchema).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUpdateOneWithoutPrimaryJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateWithoutVendorInputSchema: z.ZodType<Prisma.JobUncheckedUpdateWithoutVendorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseOrderId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  GmailMsgs: z.lazy(() => GmailMsgUncheckedUpdateManyWithoutJobNestedInputSchema).optional(),
  PurchaseOrder: z.lazy(() => PurchaseOrderUncheckedUpdateOneWithoutPrimaryJobNestedInputSchema).optional()
}).strict();

export const JobUncheckedUpdateManyWithoutOrdersInputSchema: z.ZodType<Prisma.JobUncheckedUpdateManyWithoutOrdersInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
  purchaseOrderId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GmailMsgCreateManyJobInputSchema: z.ZodType<Prisma.GmailMsgCreateManyJobInput> = z.object({
  threadId: z.string(),
  inboxMsgId: z.string(),
  direction: z.lazy(() => EmailDirectionSchema)
}).strict();

export const GmailMsgUpdateWithoutJobInputSchema: z.ZodType<Prisma.GmailMsgUpdateWithoutJobInput> = z.object({
  threadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inboxMsgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  direction: z.union([ z.lazy(() => EmailDirectionSchema),z.lazy(() => EnumEmailDirectionFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GmailMsgUncheckedUpdateWithoutJobInputSchema: z.ZodType<Prisma.GmailMsgUncheckedUpdateWithoutJobInput> = z.object({
  threadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inboxMsgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  direction: z.union([ z.lazy(() => EmailDirectionSchema),z.lazy(() => EnumEmailDirectionFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const GmailMsgUncheckedUpdateManyWithoutGmailMsgsInputSchema: z.ZodType<Prisma.GmailMsgUncheckedUpdateManyWithoutGmailMsgsInput> = z.object({
  threadId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  inboxMsgId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  direction: z.union([ z.lazy(() => EmailDirectionSchema),z.lazy(() => EnumEmailDirectionFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const JobCreateManyPurchaseOrderInputSchema: z.ZodType<Prisma.JobCreateManyPurchaseOrderInput> = z.object({
  id: z.string(),
  name: z.string(),
  price: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  type: z.lazy(() => JobTypeSchema),
  status: z.lazy(() => JobStatusSchema),
  vendorId: z.number().int()
}).strict();

export const JobUncheckedUpdateManyWithoutJobsInputSchema: z.ZodType<Prisma.JobUncheckedUpdateManyWithoutJobsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => JobTypeSchema),z.lazy(() => EnumJobTypeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => JobStatusSchema),z.lazy(() => EnumJobStatusFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientSalesRepCompanyCreateManySalesRepInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateManySalesRepInput> = z.object({
  clientId: z.string(),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' }),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional()
}).strict();

export const ClientCreateManySalesRepInputSchema: z.ZodType<Prisma.ClientCreateManySalesRepInput> = z.object({
  id: z.string().min(1).max(32),
  name: z.string().min(1).max(60),
  companyName: z.string().min(1).max(100),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  companyId: z.coerce.number().gte(1, { message: 'Please select a valid company' })
}).strict();

export const ColorSettingsCreateManySalesRepInputSchema: z.ZodType<Prisma.ColorSettingsCreateManySalesRepInput> = z.object({
  accentColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  primaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  secondaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  auxiliaryColor: z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),
  theme: z.lazy(() => ThemeSchema)
}).strict();

export const ClientSalesRepCompanyUpdateWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateWithoutSalesRepInput> = z.object({
  fromDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  toDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  client: z.lazy(() => ClientUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema).optional()
}).strict();

export const ClientSalesRepCompanyUncheckedUpdateWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedUpdateWithoutSalesRepInput> = z.object({
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fromDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  toDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientUpdateWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientUpdateWithoutSalesRepInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emails: z.lazy(() => ClientEmailUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutClientNestedInputSchema).optional(),
  company: z.lazy(() => CompanyUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientUncheckedUpdateWithoutSalesRepInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateWithoutSalesRepInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  companyId: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  emails: z.lazy(() => ClientEmailUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientUncheckedUpdateManyWithoutClientInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateManyWithoutClientInput> = z.object({
  id: z.union([ z.string().min(1).max(32),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string().min(1).max(60),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string().min(1).max(100),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  companyId: z.union([ z.coerce.number().gte(1, { message: 'Please select a valid company' }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColorSettingsUpdateWithoutSalesRepInputSchema: z.ZodType<Prisma.ColorSettingsUpdateWithoutSalesRepInput> = z.object({
  accentColor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primaryColor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondaryColor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auxiliaryColor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  theme: z.union([ z.lazy(() => ThemeSchema),z.lazy(() => EnumThemeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColorSettingsUncheckedUpdateWithoutSalesRepInputSchema: z.ZodType<Prisma.ColorSettingsUncheckedUpdateWithoutSalesRepInput> = z.object({
  accentColor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primaryColor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondaryColor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auxiliaryColor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  theme: z.union([ z.lazy(() => ThemeSchema),z.lazy(() => EnumThemeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ColorSettingsUncheckedUpdateManyWithoutSalesRepColorsInputSchema: z.ZodType<Prisma.ColorSettingsUncheckedUpdateManyWithoutSalesRepColorsInput> = z.object({
  accentColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  primaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  secondaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  auxiliaryColor: z.union([ z.string().min(4).max(8).refine((v) => validator.isHexColor(v), { message: 'Must be a valid hex color' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  theme: z.union([ z.lazy(() => ThemeSchema),z.lazy(() => EnumThemeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SalesRepCreateManyCompanyInputSchema: z.ZodType<Prisma.SalesRepCreateManyCompanyInput> = z.object({
  id: z.number().int().optional(),
  username: z.string().min(2).max(10).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),
  name: z.string(),
  email: z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),
  phone: z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' })
}).strict();

export const ClientSalesRepCompanyCreateManyCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateManyCompanyInput> = z.object({
  clientId: z.string(),
  salesRepUsername: z.string(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional()
}).strict();

export const ClientCreateManyCompanyInputSchema: z.ZodType<Prisma.ClientCreateManyCompanyInput> = z.object({
  id: z.string().min(1).max(32),
  name: z.string().min(1).max(60),
  companyName: z.string().min(1).max(100),
  createdAt: z.coerce.date().optional(),
  addTransactionCharges: z.boolean(),
  updatedAt: z.coerce.date().optional(),
  payMethod: z.lazy(() => PayMethodSchema),
  currency: z.lazy(() => CurrencySchema),
  status: z.lazy(() => ClientStatusSchema),
  notes: z.string().optional().nullable(),
  salesRepUsername: z.string().min(2).max(20).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' })
}).strict();

export const SalesRepUpdateWithoutCompanyInputSchema: z.ZodType<Prisma.SalesRepUpdateWithoutCompanyInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSalesRepNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  client: z.lazy(() => ClientUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const SalesRepUncheckedUpdateWithoutCompanyInputSchema: z.ZodType<Prisma.SalesRepUncheckedUpdateWithoutCompanyInput> = z.object({
  id: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  client: z.lazy(() => ClientUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional(),
  SalesRepColors: z.lazy(() => ColorSettingsUncheckedUpdateManyWithoutSalesRepNestedInputSchema).optional()
}).strict();

export const SalesRepUncheckedUpdateManyWithoutSalesRepInputSchema: z.ZodType<Prisma.SalesRepUncheckedUpdateManyWithoutSalesRepInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string().min(2).max(10).refine((v) => validator.isAlphanumeric(v), { message: 'Username can only contain alphanumeric characters' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string().refine((v) => validator.isEmail(v), { message: 'Invalid email' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().min(6).max(18).refine((v) => validator.isMobilePhone(v), { message: 'Must be a valid phone number' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientSalesRepCompanyUpdateWithoutCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateWithoutCompanyInput> = z.object({
  fromDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  toDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  client: z.lazy(() => ClientUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepUpdateOneRequiredWithoutClientSalesRepCompanyNestedInputSchema).optional()
}).strict();

export const ClientSalesRepCompanyUncheckedUpdateWithoutCompanyInputSchema: z.ZodType<Prisma.ClientSalesRepCompanyUncheckedUpdateWithoutCompanyInput> = z.object({
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  salesRepUsername: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fromDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  toDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClientUpdateWithoutCompanyInputSchema: z.ZodType<Prisma.ClientUpdateWithoutCompanyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  emails: z.lazy(() => ClientEmailUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUpdateManyWithoutClientNestedInputSchema).optional(),
  salesRep: z.lazy(() => SalesRepUpdateOneRequiredWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const ClientUncheckedUpdateWithoutCompanyInputSchema: z.ZodType<Prisma.ClientUncheckedUpdateWithoutCompanyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  addTransactionCharges: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payMethod: z.union([ z.lazy(() => PayMethodSchema),z.lazy(() => EnumPayMethodFieldUpdateOperationsInputSchema) ]).optional(),
  currency: z.union([ z.lazy(() => CurrencySchema),z.lazy(() => EnumCurrencyFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => ClientStatusSchema),z.lazy(() => EnumClientStatusFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRepUsername: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emails: z.lazy(() => ClientEmailUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  phones: z.lazy(() => ClientPhoneUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  orders: z.lazy(() => PurchaseOrderUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientSalesRepCompany: z.lazy(() => ClientSalesRepCompanyUncheckedUpdateManyWithoutClientNestedInputSchema).optional(),
  clientAddress: z.lazy(() => ClientAddressUncheckedUpdateOneWithoutClientNestedInputSchema).optional()
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.object({
  id: z.string(),
  active_expires: z.bigint(),
  idle_expires: z.bigint()
}).strict();

export const KeyCreateManyUserInputSchema: z.ZodType<Prisma.KeyCreateManyUserInput> = z.object({
  id: z.string(),
  hashed_password: z.string().optional().nullable(),
  primary: z.boolean(),
  expires: z.bigint().optional().nullable()
}).strict();

export const UserSettingsCreateManyUserInputSchema: z.ZodType<Prisma.UserSettingsCreateManyUserInput> = z.object({
  settings: z.string().min(2).max(5000).refine((v) => validator.isJSON(v), { message: 'Invalid settings object' })
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  idle_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  idle_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutSessionInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutSessionInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  idle_expires: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KeyUpdateWithoutUserInputSchema: z.ZodType<Prisma.KeyUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hashed_password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  primary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.bigint(),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const KeyUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.KeyUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hashed_password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  primary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.bigint(),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const KeyUncheckedUpdateManyWithoutKeyInputSchema: z.ZodType<Prisma.KeyUncheckedUpdateManyWithoutKeyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  hashed_password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  primary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.bigint(),z.lazy(() => NullableBigIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserSettingsUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUpdateWithoutUserInput> = z.object({
  settings: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserSettingsUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUncheckedUpdateWithoutUserInput> = z.object({
  settings: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserSettingsUncheckedUpdateManyWithoutUserSettingsInputSchema: z.ZodType<Prisma.UserSettingsUncheckedUpdateManyWithoutUserSettingsInput> = z.object({
  settings: z.union([ z.string().min(2).max(5000).refine((v) => validator.isJSON(v), { message: 'Invalid settings object' }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ClientFindFirstArgsSchema: z.ZodType<Prisma.ClientFindFirstArgs> = z.object({
  select: ClientSelectSchema.optional(),
  include: ClientIncludeSchema.optional(),
  where: ClientWhereInputSchema.optional(),
  orderBy: z.union([ ClientOrderByWithRelationInputSchema.array(),ClientOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ClientFindFirstOrThrowArgs> = z.object({
  select: ClientSelectSchema.optional(),
  include: ClientIncludeSchema.optional(),
  where: ClientWhereInputSchema.optional(),
  orderBy: z.union([ ClientOrderByWithRelationInputSchema.array(),ClientOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientFindManyArgsSchema: z.ZodType<Prisma.ClientFindManyArgs> = z.object({
  select: ClientSelectSchema.optional(),
  include: ClientIncludeSchema.optional(),
  where: ClientWhereInputSchema.optional(),
  orderBy: z.union([ ClientOrderByWithRelationInputSchema.array(),ClientOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientAggregateArgsSchema: z.ZodType<Prisma.ClientAggregateArgs> = z.object({
  where: ClientWhereInputSchema.optional(),
  orderBy: z.union([ ClientOrderByWithRelationInputSchema.array(),ClientOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ClientGroupByArgsSchema: z.ZodType<Prisma.ClientGroupByArgs> = z.object({
  where: ClientWhereInputSchema.optional(),
  orderBy: z.union([ ClientOrderByWithAggregationInputSchema.array(),ClientOrderByWithAggregationInputSchema ]).optional(),
  by: ClientScalarFieldEnumSchema.array(),
  having: ClientScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ClientFindUniqueArgsSchema: z.ZodType<Prisma.ClientFindUniqueArgs> = z.object({
  select: ClientSelectSchema.optional(),
  include: ClientIncludeSchema.optional(),
  where: ClientWhereUniqueInputSchema,
}).strict()

export const ClientFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ClientFindUniqueOrThrowArgs> = z.object({
  select: ClientSelectSchema.optional(),
  include: ClientIncludeSchema.optional(),
  where: ClientWhereUniqueInputSchema,
}).strict()

export const VendorFindFirstArgsSchema: z.ZodType<Prisma.VendorFindFirstArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereInputSchema.optional(),
  orderBy: z.union([ VendorOrderByWithRelationInputSchema.array(),VendorOrderByWithRelationInputSchema ]).optional(),
  cursor: VendorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: VendorScalarFieldEnumSchema.array().optional(),
}).strict()

export const VendorFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VendorFindFirstOrThrowArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereInputSchema.optional(),
  orderBy: z.union([ VendorOrderByWithRelationInputSchema.array(),VendorOrderByWithRelationInputSchema ]).optional(),
  cursor: VendorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: VendorScalarFieldEnumSchema.array().optional(),
}).strict()

export const VendorFindManyArgsSchema: z.ZodType<Prisma.VendorFindManyArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereInputSchema.optional(),
  orderBy: z.union([ VendorOrderByWithRelationInputSchema.array(),VendorOrderByWithRelationInputSchema ]).optional(),
  cursor: VendorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: VendorScalarFieldEnumSchema.array().optional(),
}).strict()

export const VendorAggregateArgsSchema: z.ZodType<Prisma.VendorAggregateArgs> = z.object({
  where: VendorWhereInputSchema.optional(),
  orderBy: z.union([ VendorOrderByWithRelationInputSchema.array(),VendorOrderByWithRelationInputSchema ]).optional(),
  cursor: VendorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const VendorGroupByArgsSchema: z.ZodType<Prisma.VendorGroupByArgs> = z.object({
  where: VendorWhereInputSchema.optional(),
  orderBy: z.union([ VendorOrderByWithAggregationInputSchema.array(),VendorOrderByWithAggregationInputSchema ]).optional(),
  by: VendorScalarFieldEnumSchema.array(),
  having: VendorScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const VendorFindUniqueArgsSchema: z.ZodType<Prisma.VendorFindUniqueArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereUniqueInputSchema,
}).strict()

export const VendorFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VendorFindUniqueOrThrowArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereUniqueInputSchema,
}).strict()

export const GmailMsgFindFirstArgsSchema: z.ZodType<Prisma.GmailMsgFindFirstArgs> = z.object({
  select: GmailMsgSelectSchema.optional(),
  include: GmailMsgIncludeSchema.optional(),
  where: GmailMsgWhereInputSchema.optional(),
  orderBy: z.union([ GmailMsgOrderByWithRelationInputSchema.array(),GmailMsgOrderByWithRelationInputSchema ]).optional(),
  cursor: GmailMsgWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: GmailMsgScalarFieldEnumSchema.array().optional(),
}).strict()

export const GmailMsgFindFirstOrThrowArgsSchema: z.ZodType<Prisma.GmailMsgFindFirstOrThrowArgs> = z.object({
  select: GmailMsgSelectSchema.optional(),
  include: GmailMsgIncludeSchema.optional(),
  where: GmailMsgWhereInputSchema.optional(),
  orderBy: z.union([ GmailMsgOrderByWithRelationInputSchema.array(),GmailMsgOrderByWithRelationInputSchema ]).optional(),
  cursor: GmailMsgWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: GmailMsgScalarFieldEnumSchema.array().optional(),
}).strict()

export const GmailMsgFindManyArgsSchema: z.ZodType<Prisma.GmailMsgFindManyArgs> = z.object({
  select: GmailMsgSelectSchema.optional(),
  include: GmailMsgIncludeSchema.optional(),
  where: GmailMsgWhereInputSchema.optional(),
  orderBy: z.union([ GmailMsgOrderByWithRelationInputSchema.array(),GmailMsgOrderByWithRelationInputSchema ]).optional(),
  cursor: GmailMsgWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: GmailMsgScalarFieldEnumSchema.array().optional(),
}).strict()

export const GmailMsgAggregateArgsSchema: z.ZodType<Prisma.GmailMsgAggregateArgs> = z.object({
  where: GmailMsgWhereInputSchema.optional(),
  orderBy: z.union([ GmailMsgOrderByWithRelationInputSchema.array(),GmailMsgOrderByWithRelationInputSchema ]).optional(),
  cursor: GmailMsgWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const GmailMsgGroupByArgsSchema: z.ZodType<Prisma.GmailMsgGroupByArgs> = z.object({
  where: GmailMsgWhereInputSchema.optional(),
  orderBy: z.union([ GmailMsgOrderByWithAggregationInputSchema.array(),GmailMsgOrderByWithAggregationInputSchema ]).optional(),
  by: GmailMsgScalarFieldEnumSchema.array(),
  having: GmailMsgScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const GmailMsgFindUniqueArgsSchema: z.ZodType<Prisma.GmailMsgFindUniqueArgs> = z.object({
  select: GmailMsgSelectSchema.optional(),
  include: GmailMsgIncludeSchema.optional(),
  where: GmailMsgWhereUniqueInputSchema,
}).strict()

export const GmailMsgFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.GmailMsgFindUniqueOrThrowArgs> = z.object({
  select: GmailMsgSelectSchema.optional(),
  include: GmailMsgIncludeSchema.optional(),
  where: GmailMsgWhereUniqueInputSchema,
}).strict()

export const JobFindFirstArgsSchema: z.ZodType<Prisma.JobFindFirstArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereInputSchema.optional(),
  orderBy: z.union([ JobOrderByWithRelationInputSchema.array(),JobOrderByWithRelationInputSchema ]).optional(),
  cursor: JobWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: JobScalarFieldEnumSchema.array().optional(),
}).strict()

export const JobFindFirstOrThrowArgsSchema: z.ZodType<Prisma.JobFindFirstOrThrowArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereInputSchema.optional(),
  orderBy: z.union([ JobOrderByWithRelationInputSchema.array(),JobOrderByWithRelationInputSchema ]).optional(),
  cursor: JobWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: JobScalarFieldEnumSchema.array().optional(),
}).strict()

export const JobFindManyArgsSchema: z.ZodType<Prisma.JobFindManyArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereInputSchema.optional(),
  orderBy: z.union([ JobOrderByWithRelationInputSchema.array(),JobOrderByWithRelationInputSchema ]).optional(),
  cursor: JobWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: JobScalarFieldEnumSchema.array().optional(),
}).strict()

export const JobAggregateArgsSchema: z.ZodType<Prisma.JobAggregateArgs> = z.object({
  where: JobWhereInputSchema.optional(),
  orderBy: z.union([ JobOrderByWithRelationInputSchema.array(),JobOrderByWithRelationInputSchema ]).optional(),
  cursor: JobWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const JobGroupByArgsSchema: z.ZodType<Prisma.JobGroupByArgs> = z.object({
  where: JobWhereInputSchema.optional(),
  orderBy: z.union([ JobOrderByWithAggregationInputSchema.array(),JobOrderByWithAggregationInputSchema ]).optional(),
  by: JobScalarFieldEnumSchema.array(),
  having: JobScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const JobFindUniqueArgsSchema: z.ZodType<Prisma.JobFindUniqueArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereUniqueInputSchema,
}).strict()

export const JobFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.JobFindUniqueOrThrowArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereUniqueInputSchema,
}).strict()

export const PurchaseOrderFindFirstArgsSchema: z.ZodType<Prisma.PurchaseOrderFindFirstArgs> = z.object({
  select: PurchaseOrderSelectSchema.optional(),
  include: PurchaseOrderIncludeSchema.optional(),
  where: PurchaseOrderWhereInputSchema.optional(),
  orderBy: z.union([ PurchaseOrderOrderByWithRelationInputSchema.array(),PurchaseOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PurchaseOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PurchaseOrderScalarFieldEnumSchema.array().optional(),
}).strict()

export const PurchaseOrderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PurchaseOrderFindFirstOrThrowArgs> = z.object({
  select: PurchaseOrderSelectSchema.optional(),
  include: PurchaseOrderIncludeSchema.optional(),
  where: PurchaseOrderWhereInputSchema.optional(),
  orderBy: z.union([ PurchaseOrderOrderByWithRelationInputSchema.array(),PurchaseOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PurchaseOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PurchaseOrderScalarFieldEnumSchema.array().optional(),
}).strict()

export const PurchaseOrderFindManyArgsSchema: z.ZodType<Prisma.PurchaseOrderFindManyArgs> = z.object({
  select: PurchaseOrderSelectSchema.optional(),
  include: PurchaseOrderIncludeSchema.optional(),
  where: PurchaseOrderWhereInputSchema.optional(),
  orderBy: z.union([ PurchaseOrderOrderByWithRelationInputSchema.array(),PurchaseOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PurchaseOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: PurchaseOrderScalarFieldEnumSchema.array().optional(),
}).strict()

export const PurchaseOrderAggregateArgsSchema: z.ZodType<Prisma.PurchaseOrderAggregateArgs> = z.object({
  where: PurchaseOrderWhereInputSchema.optional(),
  orderBy: z.union([ PurchaseOrderOrderByWithRelationInputSchema.array(),PurchaseOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PurchaseOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PurchaseOrderGroupByArgsSchema: z.ZodType<Prisma.PurchaseOrderGroupByArgs> = z.object({
  where: PurchaseOrderWhereInputSchema.optional(),
  orderBy: z.union([ PurchaseOrderOrderByWithAggregationInputSchema.array(),PurchaseOrderOrderByWithAggregationInputSchema ]).optional(),
  by: PurchaseOrderScalarFieldEnumSchema.array(),
  having: PurchaseOrderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const PurchaseOrderFindUniqueArgsSchema: z.ZodType<Prisma.PurchaseOrderFindUniqueArgs> = z.object({
  select: PurchaseOrderSelectSchema.optional(),
  include: PurchaseOrderIncludeSchema.optional(),
  where: PurchaseOrderWhereUniqueInputSchema,
}).strict()

export const PurchaseOrderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PurchaseOrderFindUniqueOrThrowArgs> = z.object({
  select: PurchaseOrderSelectSchema.optional(),
  include: PurchaseOrderIncludeSchema.optional(),
  where: PurchaseOrderWhereUniqueInputSchema,
}).strict()

export const SalesRepFindFirstArgsSchema: z.ZodType<Prisma.SalesRepFindFirstArgs> = z.object({
  select: SalesRepSelectSchema.optional(),
  include: SalesRepIncludeSchema.optional(),
  where: SalesRepWhereInputSchema.optional(),
  orderBy: z.union([ SalesRepOrderByWithRelationInputSchema.array(),SalesRepOrderByWithRelationInputSchema ]).optional(),
  cursor: SalesRepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SalesRepScalarFieldEnumSchema.array().optional(),
}).strict()

export const SalesRepFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SalesRepFindFirstOrThrowArgs> = z.object({
  select: SalesRepSelectSchema.optional(),
  include: SalesRepIncludeSchema.optional(),
  where: SalesRepWhereInputSchema.optional(),
  orderBy: z.union([ SalesRepOrderByWithRelationInputSchema.array(),SalesRepOrderByWithRelationInputSchema ]).optional(),
  cursor: SalesRepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SalesRepScalarFieldEnumSchema.array().optional(),
}).strict()

export const SalesRepFindManyArgsSchema: z.ZodType<Prisma.SalesRepFindManyArgs> = z.object({
  select: SalesRepSelectSchema.optional(),
  include: SalesRepIncludeSchema.optional(),
  where: SalesRepWhereInputSchema.optional(),
  orderBy: z.union([ SalesRepOrderByWithRelationInputSchema.array(),SalesRepOrderByWithRelationInputSchema ]).optional(),
  cursor: SalesRepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SalesRepScalarFieldEnumSchema.array().optional(),
}).strict()

export const SalesRepAggregateArgsSchema: z.ZodType<Prisma.SalesRepAggregateArgs> = z.object({
  where: SalesRepWhereInputSchema.optional(),
  orderBy: z.union([ SalesRepOrderByWithRelationInputSchema.array(),SalesRepOrderByWithRelationInputSchema ]).optional(),
  cursor: SalesRepWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const SalesRepGroupByArgsSchema: z.ZodType<Prisma.SalesRepGroupByArgs> = z.object({
  where: SalesRepWhereInputSchema.optional(),
  orderBy: z.union([ SalesRepOrderByWithAggregationInputSchema.array(),SalesRepOrderByWithAggregationInputSchema ]).optional(),
  by: SalesRepScalarFieldEnumSchema.array(),
  having: SalesRepScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const SalesRepFindUniqueArgsSchema: z.ZodType<Prisma.SalesRepFindUniqueArgs> = z.object({
  select: SalesRepSelectSchema.optional(),
  include: SalesRepIncludeSchema.optional(),
  where: SalesRepWhereUniqueInputSchema,
}).strict()

export const SalesRepFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SalesRepFindUniqueOrThrowArgs> = z.object({
  select: SalesRepSelectSchema.optional(),
  include: SalesRepIncludeSchema.optional(),
  where: SalesRepWhereUniqueInputSchema,
}).strict()

export const ColorSettingsFindFirstArgsSchema: z.ZodType<Prisma.ColorSettingsFindFirstArgs> = z.object({
  select: ColorSettingsSelectSchema.optional(),
  include: ColorSettingsIncludeSchema.optional(),
  where: ColorSettingsWhereInputSchema.optional(),
  orderBy: z.union([ ColorSettingsOrderByWithRelationInputSchema.array(),ColorSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: ColorSettingsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ColorSettingsScalarFieldEnumSchema.array().optional(),
}).strict()

export const ColorSettingsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ColorSettingsFindFirstOrThrowArgs> = z.object({
  select: ColorSettingsSelectSchema.optional(),
  include: ColorSettingsIncludeSchema.optional(),
  where: ColorSettingsWhereInputSchema.optional(),
  orderBy: z.union([ ColorSettingsOrderByWithRelationInputSchema.array(),ColorSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: ColorSettingsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ColorSettingsScalarFieldEnumSchema.array().optional(),
}).strict()

export const ColorSettingsFindManyArgsSchema: z.ZodType<Prisma.ColorSettingsFindManyArgs> = z.object({
  select: ColorSettingsSelectSchema.optional(),
  include: ColorSettingsIncludeSchema.optional(),
  where: ColorSettingsWhereInputSchema.optional(),
  orderBy: z.union([ ColorSettingsOrderByWithRelationInputSchema.array(),ColorSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: ColorSettingsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ColorSettingsScalarFieldEnumSchema.array().optional(),
}).strict()

export const ColorSettingsAggregateArgsSchema: z.ZodType<Prisma.ColorSettingsAggregateArgs> = z.object({
  where: ColorSettingsWhereInputSchema.optional(),
  orderBy: z.union([ ColorSettingsOrderByWithRelationInputSchema.array(),ColorSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: ColorSettingsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ColorSettingsGroupByArgsSchema: z.ZodType<Prisma.ColorSettingsGroupByArgs> = z.object({
  where: ColorSettingsWhereInputSchema.optional(),
  orderBy: z.union([ ColorSettingsOrderByWithAggregationInputSchema.array(),ColorSettingsOrderByWithAggregationInputSchema ]).optional(),
  by: ColorSettingsScalarFieldEnumSchema.array(),
  having: ColorSettingsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ColorSettingsFindUniqueArgsSchema: z.ZodType<Prisma.ColorSettingsFindUniqueArgs> = z.object({
  select: ColorSettingsSelectSchema.optional(),
  include: ColorSettingsIncludeSchema.optional(),
  where: ColorSettingsWhereUniqueInputSchema,
}).strict()

export const ColorSettingsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ColorSettingsFindUniqueOrThrowArgs> = z.object({
  select: ColorSettingsSelectSchema.optional(),
  include: ColorSettingsIncludeSchema.optional(),
  where: ColorSettingsWhereUniqueInputSchema,
}).strict()

export const UserSettingsFindFirstArgsSchema: z.ZodType<Prisma.UserSettingsFindFirstArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereInputSchema.optional(),
  orderBy: z.union([ UserSettingsOrderByWithRelationInputSchema.array(),UserSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: UserSettingsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserSettingsScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserSettingsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserSettingsFindFirstOrThrowArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereInputSchema.optional(),
  orderBy: z.union([ UserSettingsOrderByWithRelationInputSchema.array(),UserSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: UserSettingsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserSettingsScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserSettingsFindManyArgsSchema: z.ZodType<Prisma.UserSettingsFindManyArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereInputSchema.optional(),
  orderBy: z.union([ UserSettingsOrderByWithRelationInputSchema.array(),UserSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: UserSettingsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserSettingsScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserSettingsAggregateArgsSchema: z.ZodType<Prisma.UserSettingsAggregateArgs> = z.object({
  where: UserSettingsWhereInputSchema.optional(),
  orderBy: z.union([ UserSettingsOrderByWithRelationInputSchema.array(),UserSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: UserSettingsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const UserSettingsGroupByArgsSchema: z.ZodType<Prisma.UserSettingsGroupByArgs> = z.object({
  where: UserSettingsWhereInputSchema.optional(),
  orderBy: z.union([ UserSettingsOrderByWithAggregationInputSchema.array(),UserSettingsOrderByWithAggregationInputSchema ]).optional(),
  by: UserSettingsScalarFieldEnumSchema.array(),
  having: UserSettingsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const UserSettingsFindUniqueArgsSchema: z.ZodType<Prisma.UserSettingsFindUniqueArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereUniqueInputSchema,
}).strict()

export const UserSettingsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserSettingsFindUniqueOrThrowArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereUniqueInputSchema,
}).strict()

export const ClientSalesRepCompanyFindFirstArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyFindFirstArgs> = z.object({
  select: ClientSalesRepCompanySelectSchema.optional(),
  include: ClientSalesRepCompanyIncludeSchema.optional(),
  where: ClientSalesRepCompanyWhereInputSchema.optional(),
  orderBy: z.union([ ClientSalesRepCompanyOrderByWithRelationInputSchema.array(),ClientSalesRepCompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientSalesRepCompanyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientSalesRepCompanyScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientSalesRepCompanyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyFindFirstOrThrowArgs> = z.object({
  select: ClientSalesRepCompanySelectSchema.optional(),
  include: ClientSalesRepCompanyIncludeSchema.optional(),
  where: ClientSalesRepCompanyWhereInputSchema.optional(),
  orderBy: z.union([ ClientSalesRepCompanyOrderByWithRelationInputSchema.array(),ClientSalesRepCompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientSalesRepCompanyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientSalesRepCompanyScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientSalesRepCompanyFindManyArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyFindManyArgs> = z.object({
  select: ClientSalesRepCompanySelectSchema.optional(),
  include: ClientSalesRepCompanyIncludeSchema.optional(),
  where: ClientSalesRepCompanyWhereInputSchema.optional(),
  orderBy: z.union([ ClientSalesRepCompanyOrderByWithRelationInputSchema.array(),ClientSalesRepCompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientSalesRepCompanyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientSalesRepCompanyScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientSalesRepCompanyAggregateArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyAggregateArgs> = z.object({
  where: ClientSalesRepCompanyWhereInputSchema.optional(),
  orderBy: z.union([ ClientSalesRepCompanyOrderByWithRelationInputSchema.array(),ClientSalesRepCompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientSalesRepCompanyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ClientSalesRepCompanyGroupByArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyGroupByArgs> = z.object({
  where: ClientSalesRepCompanyWhereInputSchema.optional(),
  orderBy: z.union([ ClientSalesRepCompanyOrderByWithAggregationInputSchema.array(),ClientSalesRepCompanyOrderByWithAggregationInputSchema ]).optional(),
  by: ClientSalesRepCompanyScalarFieldEnumSchema.array(),
  having: ClientSalesRepCompanyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ClientSalesRepCompanyFindUniqueArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyFindUniqueArgs> = z.object({
  select: ClientSalesRepCompanySelectSchema.optional(),
  include: ClientSalesRepCompanyIncludeSchema.optional(),
  where: ClientSalesRepCompanyWhereUniqueInputSchema,
}).strict()

export const ClientSalesRepCompanyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyFindUniqueOrThrowArgs> = z.object({
  select: ClientSalesRepCompanySelectSchema.optional(),
  include: ClientSalesRepCompanyIncludeSchema.optional(),
  where: ClientSalesRepCompanyWhereUniqueInputSchema,
}).strict()

export const ClientAddressFindFirstArgsSchema: z.ZodType<Prisma.ClientAddressFindFirstArgs> = z.object({
  select: ClientAddressSelectSchema.optional(),
  include: ClientAddressIncludeSchema.optional(),
  where: ClientAddressWhereInputSchema.optional(),
  orderBy: z.union([ ClientAddressOrderByWithRelationInputSchema.array(),ClientAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientAddressScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientAddressFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ClientAddressFindFirstOrThrowArgs> = z.object({
  select: ClientAddressSelectSchema.optional(),
  include: ClientAddressIncludeSchema.optional(),
  where: ClientAddressWhereInputSchema.optional(),
  orderBy: z.union([ ClientAddressOrderByWithRelationInputSchema.array(),ClientAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientAddressScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientAddressFindManyArgsSchema: z.ZodType<Prisma.ClientAddressFindManyArgs> = z.object({
  select: ClientAddressSelectSchema.optional(),
  include: ClientAddressIncludeSchema.optional(),
  where: ClientAddressWhereInputSchema.optional(),
  orderBy: z.union([ ClientAddressOrderByWithRelationInputSchema.array(),ClientAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientAddressScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientAddressAggregateArgsSchema: z.ZodType<Prisma.ClientAddressAggregateArgs> = z.object({
  where: ClientAddressWhereInputSchema.optional(),
  orderBy: z.union([ ClientAddressOrderByWithRelationInputSchema.array(),ClientAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ClientAddressGroupByArgsSchema: z.ZodType<Prisma.ClientAddressGroupByArgs> = z.object({
  where: ClientAddressWhereInputSchema.optional(),
  orderBy: z.union([ ClientAddressOrderByWithAggregationInputSchema.array(),ClientAddressOrderByWithAggregationInputSchema ]).optional(),
  by: ClientAddressScalarFieldEnumSchema.array(),
  having: ClientAddressScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ClientAddressFindUniqueArgsSchema: z.ZodType<Prisma.ClientAddressFindUniqueArgs> = z.object({
  select: ClientAddressSelectSchema.optional(),
  include: ClientAddressIncludeSchema.optional(),
  where: ClientAddressWhereUniqueInputSchema,
}).strict()

export const ClientAddressFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ClientAddressFindUniqueOrThrowArgs> = z.object({
  select: ClientAddressSelectSchema.optional(),
  include: ClientAddressIncludeSchema.optional(),
  where: ClientAddressWhereUniqueInputSchema,
}).strict()

export const ClientEmailFindFirstArgsSchema: z.ZodType<Prisma.ClientEmailFindFirstArgs> = z.object({
  select: ClientEmailSelectSchema.optional(),
  include: ClientEmailIncludeSchema.optional(),
  where: ClientEmailWhereInputSchema.optional(),
  orderBy: z.union([ ClientEmailOrderByWithRelationInputSchema.array(),ClientEmailOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientEmailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientEmailScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientEmailFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ClientEmailFindFirstOrThrowArgs> = z.object({
  select: ClientEmailSelectSchema.optional(),
  include: ClientEmailIncludeSchema.optional(),
  where: ClientEmailWhereInputSchema.optional(),
  orderBy: z.union([ ClientEmailOrderByWithRelationInputSchema.array(),ClientEmailOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientEmailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientEmailScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientEmailFindManyArgsSchema: z.ZodType<Prisma.ClientEmailFindManyArgs> = z.object({
  select: ClientEmailSelectSchema.optional(),
  include: ClientEmailIncludeSchema.optional(),
  where: ClientEmailWhereInputSchema.optional(),
  orderBy: z.union([ ClientEmailOrderByWithRelationInputSchema.array(),ClientEmailOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientEmailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientEmailScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientEmailAggregateArgsSchema: z.ZodType<Prisma.ClientEmailAggregateArgs> = z.object({
  where: ClientEmailWhereInputSchema.optional(),
  orderBy: z.union([ ClientEmailOrderByWithRelationInputSchema.array(),ClientEmailOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientEmailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ClientEmailGroupByArgsSchema: z.ZodType<Prisma.ClientEmailGroupByArgs> = z.object({
  where: ClientEmailWhereInputSchema.optional(),
  orderBy: z.union([ ClientEmailOrderByWithAggregationInputSchema.array(),ClientEmailOrderByWithAggregationInputSchema ]).optional(),
  by: ClientEmailScalarFieldEnumSchema.array(),
  having: ClientEmailScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ClientEmailFindUniqueArgsSchema: z.ZodType<Prisma.ClientEmailFindUniqueArgs> = z.object({
  select: ClientEmailSelectSchema.optional(),
  include: ClientEmailIncludeSchema.optional(),
  where: ClientEmailWhereUniqueInputSchema,
}).strict()

export const ClientEmailFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ClientEmailFindUniqueOrThrowArgs> = z.object({
  select: ClientEmailSelectSchema.optional(),
  include: ClientEmailIncludeSchema.optional(),
  where: ClientEmailWhereUniqueInputSchema,
}).strict()

export const ClientPhoneFindFirstArgsSchema: z.ZodType<Prisma.ClientPhoneFindFirstArgs> = z.object({
  select: ClientPhoneSelectSchema.optional(),
  include: ClientPhoneIncludeSchema.optional(),
  where: ClientPhoneWhereInputSchema.optional(),
  orderBy: z.union([ ClientPhoneOrderByWithRelationInputSchema.array(),ClientPhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientPhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientPhoneScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientPhoneFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ClientPhoneFindFirstOrThrowArgs> = z.object({
  select: ClientPhoneSelectSchema.optional(),
  include: ClientPhoneIncludeSchema.optional(),
  where: ClientPhoneWhereInputSchema.optional(),
  orderBy: z.union([ ClientPhoneOrderByWithRelationInputSchema.array(),ClientPhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientPhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientPhoneScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientPhoneFindManyArgsSchema: z.ZodType<Prisma.ClientPhoneFindManyArgs> = z.object({
  select: ClientPhoneSelectSchema.optional(),
  include: ClientPhoneIncludeSchema.optional(),
  where: ClientPhoneWhereInputSchema.optional(),
  orderBy: z.union([ ClientPhoneOrderByWithRelationInputSchema.array(),ClientPhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientPhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: ClientPhoneScalarFieldEnumSchema.array().optional(),
}).strict()

export const ClientPhoneAggregateArgsSchema: z.ZodType<Prisma.ClientPhoneAggregateArgs> = z.object({
  where: ClientPhoneWhereInputSchema.optional(),
  orderBy: z.union([ ClientPhoneOrderByWithRelationInputSchema.array(),ClientPhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: ClientPhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ClientPhoneGroupByArgsSchema: z.ZodType<Prisma.ClientPhoneGroupByArgs> = z.object({
  where: ClientPhoneWhereInputSchema.optional(),
  orderBy: z.union([ ClientPhoneOrderByWithAggregationInputSchema.array(),ClientPhoneOrderByWithAggregationInputSchema ]).optional(),
  by: ClientPhoneScalarFieldEnumSchema.array(),
  having: ClientPhoneScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const ClientPhoneFindUniqueArgsSchema: z.ZodType<Prisma.ClientPhoneFindUniqueArgs> = z.object({
  select: ClientPhoneSelectSchema.optional(),
  include: ClientPhoneIncludeSchema.optional(),
  where: ClientPhoneWhereUniqueInputSchema,
}).strict()

export const ClientPhoneFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ClientPhoneFindUniqueOrThrowArgs> = z.object({
  select: ClientPhoneSelectSchema.optional(),
  include: ClientPhoneIncludeSchema.optional(),
  where: ClientPhoneWhereUniqueInputSchema,
}).strict()

export const CompanyFindFirstArgsSchema: z.ZodType<Prisma.CompanyFindFirstArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereInputSchema.optional(),
  orderBy: z.union([ CompanyOrderByWithRelationInputSchema.array(),CompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: CompanyScalarFieldEnumSchema.array().optional(),
}).strict()

export const CompanyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CompanyFindFirstOrThrowArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereInputSchema.optional(),
  orderBy: z.union([ CompanyOrderByWithRelationInputSchema.array(),CompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: CompanyScalarFieldEnumSchema.array().optional(),
}).strict()

export const CompanyFindManyArgsSchema: z.ZodType<Prisma.CompanyFindManyArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereInputSchema.optional(),
  orderBy: z.union([ CompanyOrderByWithRelationInputSchema.array(),CompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: CompanyScalarFieldEnumSchema.array().optional(),
}).strict()

export const CompanyAggregateArgsSchema: z.ZodType<Prisma.CompanyAggregateArgs> = z.object({
  where: CompanyWhereInputSchema.optional(),
  orderBy: z.union([ CompanyOrderByWithRelationInputSchema.array(),CompanyOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const CompanyGroupByArgsSchema: z.ZodType<Prisma.CompanyGroupByArgs> = z.object({
  where: CompanyWhereInputSchema.optional(),
  orderBy: z.union([ CompanyOrderByWithAggregationInputSchema.array(),CompanyOrderByWithAggregationInputSchema ]).optional(),
  by: CompanyScalarFieldEnumSchema.array(),
  having: CompanyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const CompanyFindUniqueArgsSchema: z.ZodType<Prisma.CompanyFindUniqueArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereUniqueInputSchema,
}).strict()

export const CompanyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CompanyFindUniqueOrThrowArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereUniqueInputSchema,
}).strict()

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: UserScalarFieldEnumSchema.array().optional(),
}).strict()

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict()

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict()

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SessionScalarFieldEnumSchema.array().optional(),
}).strict()

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SessionScalarFieldEnumSchema.array().optional(),
}).strict()

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: SessionScalarFieldEnumSchema.array().optional(),
}).strict()

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(),SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict()

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict()

export const KeyFindFirstArgsSchema: z.ZodType<Prisma.KeyFindFirstArgs> = z.object({
  select: KeySelectSchema.optional(),
  include: KeyIncludeSchema.optional(),
  where: KeyWhereInputSchema.optional(),
  orderBy: z.union([ KeyOrderByWithRelationInputSchema.array(),KeyOrderByWithRelationInputSchema ]).optional(),
  cursor: KeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: KeyScalarFieldEnumSchema.array().optional(),
}).strict()

export const KeyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.KeyFindFirstOrThrowArgs> = z.object({
  select: KeySelectSchema.optional(),
  include: KeyIncludeSchema.optional(),
  where: KeyWhereInputSchema.optional(),
  orderBy: z.union([ KeyOrderByWithRelationInputSchema.array(),KeyOrderByWithRelationInputSchema ]).optional(),
  cursor: KeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: KeyScalarFieldEnumSchema.array().optional(),
}).strict()

export const KeyFindManyArgsSchema: z.ZodType<Prisma.KeyFindManyArgs> = z.object({
  select: KeySelectSchema.optional(),
  include: KeyIncludeSchema.optional(),
  where: KeyWhereInputSchema.optional(),
  orderBy: z.union([ KeyOrderByWithRelationInputSchema.array(),KeyOrderByWithRelationInputSchema ]).optional(),
  cursor: KeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: KeyScalarFieldEnumSchema.array().optional(),
}).strict()

export const KeyAggregateArgsSchema: z.ZodType<Prisma.KeyAggregateArgs> = z.object({
  where: KeyWhereInputSchema.optional(),
  orderBy: z.union([ KeyOrderByWithRelationInputSchema.array(),KeyOrderByWithRelationInputSchema ]).optional(),
  cursor: KeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const KeyGroupByArgsSchema: z.ZodType<Prisma.KeyGroupByArgs> = z.object({
  where: KeyWhereInputSchema.optional(),
  orderBy: z.union([ KeyOrderByWithAggregationInputSchema.array(),KeyOrderByWithAggregationInputSchema ]).optional(),
  by: KeyScalarFieldEnumSchema.array(),
  having: KeyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict()

export const KeyFindUniqueArgsSchema: z.ZodType<Prisma.KeyFindUniqueArgs> = z.object({
  select: KeySelectSchema.optional(),
  include: KeyIncludeSchema.optional(),
  where: KeyWhereUniqueInputSchema,
}).strict()

export const KeyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.KeyFindUniqueOrThrowArgs> = z.object({
  select: KeySelectSchema.optional(),
  include: KeyIncludeSchema.optional(),
  where: KeyWhereUniqueInputSchema,
}).strict()

export const ClientCreateArgsSchema: z.ZodType<Prisma.ClientCreateArgs> = z.object({
  select: ClientSelectSchema.optional(),
  include: ClientIncludeSchema.optional(),
  data: z.union([ ClientCreateInputSchema,ClientUncheckedCreateInputSchema ]),
}).strict()

export const ClientUpsertArgsSchema: z.ZodType<Prisma.ClientUpsertArgs> = z.object({
  select: ClientSelectSchema.optional(),
  include: ClientIncludeSchema.optional(),
  where: ClientWhereUniqueInputSchema,
  create: z.union([ ClientCreateInputSchema,ClientUncheckedCreateInputSchema ]),
  update: z.union([ ClientUpdateInputSchema,ClientUncheckedUpdateInputSchema ]),
}).strict()

export const ClientCreateManyArgsSchema: z.ZodType<Prisma.ClientCreateManyArgs> = z.object({
  data: z.union([ ClientCreateManyInputSchema,ClientCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ClientDeleteArgsSchema: z.ZodType<Prisma.ClientDeleteArgs> = z.object({
  select: ClientSelectSchema.optional(),
  include: ClientIncludeSchema.optional(),
  where: ClientWhereUniqueInputSchema,
}).strict()

export const ClientUpdateArgsSchema: z.ZodType<Prisma.ClientUpdateArgs> = z.object({
  select: ClientSelectSchema.optional(),
  include: ClientIncludeSchema.optional(),
  data: z.union([ ClientUpdateInputSchema,ClientUncheckedUpdateInputSchema ]),
  where: ClientWhereUniqueInputSchema,
}).strict()

export const ClientUpdateManyArgsSchema: z.ZodType<Prisma.ClientUpdateManyArgs> = z.object({
  data: z.union([ ClientUpdateManyMutationInputSchema,ClientUncheckedUpdateManyInputSchema ]),
  where: ClientWhereInputSchema.optional(),
}).strict()

export const ClientDeleteManyArgsSchema: z.ZodType<Prisma.ClientDeleteManyArgs> = z.object({
  where: ClientWhereInputSchema.optional(),
}).strict()

export const VendorCreateArgsSchema: z.ZodType<Prisma.VendorCreateArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  data: z.union([ VendorCreateInputSchema,VendorUncheckedCreateInputSchema ]),
}).strict()

export const VendorUpsertArgsSchema: z.ZodType<Prisma.VendorUpsertArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereUniqueInputSchema,
  create: z.union([ VendorCreateInputSchema,VendorUncheckedCreateInputSchema ]),
  update: z.union([ VendorUpdateInputSchema,VendorUncheckedUpdateInputSchema ]),
}).strict()

export const VendorCreateManyArgsSchema: z.ZodType<Prisma.VendorCreateManyArgs> = z.object({
  data: z.union([ VendorCreateManyInputSchema,VendorCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const VendorDeleteArgsSchema: z.ZodType<Prisma.VendorDeleteArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  where: VendorWhereUniqueInputSchema,
}).strict()

export const VendorUpdateArgsSchema: z.ZodType<Prisma.VendorUpdateArgs> = z.object({
  select: VendorSelectSchema.optional(),
  include: VendorIncludeSchema.optional(),
  data: z.union([ VendorUpdateInputSchema,VendorUncheckedUpdateInputSchema ]),
  where: VendorWhereUniqueInputSchema,
}).strict()

export const VendorUpdateManyArgsSchema: z.ZodType<Prisma.VendorUpdateManyArgs> = z.object({
  data: z.union([ VendorUpdateManyMutationInputSchema,VendorUncheckedUpdateManyInputSchema ]),
  where: VendorWhereInputSchema.optional(),
}).strict()

export const VendorDeleteManyArgsSchema: z.ZodType<Prisma.VendorDeleteManyArgs> = z.object({
  where: VendorWhereInputSchema.optional(),
}).strict()

export const GmailMsgCreateArgsSchema: z.ZodType<Prisma.GmailMsgCreateArgs> = z.object({
  select: GmailMsgSelectSchema.optional(),
  include: GmailMsgIncludeSchema.optional(),
  data: z.union([ GmailMsgCreateInputSchema,GmailMsgUncheckedCreateInputSchema ]),
}).strict()

export const GmailMsgUpsertArgsSchema: z.ZodType<Prisma.GmailMsgUpsertArgs> = z.object({
  select: GmailMsgSelectSchema.optional(),
  include: GmailMsgIncludeSchema.optional(),
  where: GmailMsgWhereUniqueInputSchema,
  create: z.union([ GmailMsgCreateInputSchema,GmailMsgUncheckedCreateInputSchema ]),
  update: z.union([ GmailMsgUpdateInputSchema,GmailMsgUncheckedUpdateInputSchema ]),
}).strict()

export const GmailMsgCreateManyArgsSchema: z.ZodType<Prisma.GmailMsgCreateManyArgs> = z.object({
  data: z.union([ GmailMsgCreateManyInputSchema,GmailMsgCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const GmailMsgDeleteArgsSchema: z.ZodType<Prisma.GmailMsgDeleteArgs> = z.object({
  select: GmailMsgSelectSchema.optional(),
  include: GmailMsgIncludeSchema.optional(),
  where: GmailMsgWhereUniqueInputSchema,
}).strict()

export const GmailMsgUpdateArgsSchema: z.ZodType<Prisma.GmailMsgUpdateArgs> = z.object({
  select: GmailMsgSelectSchema.optional(),
  include: GmailMsgIncludeSchema.optional(),
  data: z.union([ GmailMsgUpdateInputSchema,GmailMsgUncheckedUpdateInputSchema ]),
  where: GmailMsgWhereUniqueInputSchema,
}).strict()

export const GmailMsgUpdateManyArgsSchema: z.ZodType<Prisma.GmailMsgUpdateManyArgs> = z.object({
  data: z.union([ GmailMsgUpdateManyMutationInputSchema,GmailMsgUncheckedUpdateManyInputSchema ]),
  where: GmailMsgWhereInputSchema.optional(),
}).strict()

export const GmailMsgDeleteManyArgsSchema: z.ZodType<Prisma.GmailMsgDeleteManyArgs> = z.object({
  where: GmailMsgWhereInputSchema.optional(),
}).strict()

export const JobCreateArgsSchema: z.ZodType<Prisma.JobCreateArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  data: z.union([ JobCreateInputSchema,JobUncheckedCreateInputSchema ]),
}).strict()

export const JobUpsertArgsSchema: z.ZodType<Prisma.JobUpsertArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereUniqueInputSchema,
  create: z.union([ JobCreateInputSchema,JobUncheckedCreateInputSchema ]),
  update: z.union([ JobUpdateInputSchema,JobUncheckedUpdateInputSchema ]),
}).strict()

export const JobCreateManyArgsSchema: z.ZodType<Prisma.JobCreateManyArgs> = z.object({
  data: z.union([ JobCreateManyInputSchema,JobCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const JobDeleteArgsSchema: z.ZodType<Prisma.JobDeleteArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  where: JobWhereUniqueInputSchema,
}).strict()

export const JobUpdateArgsSchema: z.ZodType<Prisma.JobUpdateArgs> = z.object({
  select: JobSelectSchema.optional(),
  include: JobIncludeSchema.optional(),
  data: z.union([ JobUpdateInputSchema,JobUncheckedUpdateInputSchema ]),
  where: JobWhereUniqueInputSchema,
}).strict()

export const JobUpdateManyArgsSchema: z.ZodType<Prisma.JobUpdateManyArgs> = z.object({
  data: z.union([ JobUpdateManyMutationInputSchema,JobUncheckedUpdateManyInputSchema ]),
  where: JobWhereInputSchema.optional(),
}).strict()

export const JobDeleteManyArgsSchema: z.ZodType<Prisma.JobDeleteManyArgs> = z.object({
  where: JobWhereInputSchema.optional(),
}).strict()

export const PurchaseOrderCreateArgsSchema: z.ZodType<Prisma.PurchaseOrderCreateArgs> = z.object({
  select: PurchaseOrderSelectSchema.optional(),
  include: PurchaseOrderIncludeSchema.optional(),
  data: z.union([ PurchaseOrderCreateInputSchema,PurchaseOrderUncheckedCreateInputSchema ]),
}).strict()

export const PurchaseOrderUpsertArgsSchema: z.ZodType<Prisma.PurchaseOrderUpsertArgs> = z.object({
  select: PurchaseOrderSelectSchema.optional(),
  include: PurchaseOrderIncludeSchema.optional(),
  where: PurchaseOrderWhereUniqueInputSchema,
  create: z.union([ PurchaseOrderCreateInputSchema,PurchaseOrderUncheckedCreateInputSchema ]),
  update: z.union([ PurchaseOrderUpdateInputSchema,PurchaseOrderUncheckedUpdateInputSchema ]),
}).strict()

export const PurchaseOrderCreateManyArgsSchema: z.ZodType<Prisma.PurchaseOrderCreateManyArgs> = z.object({
  data: z.union([ PurchaseOrderCreateManyInputSchema,PurchaseOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const PurchaseOrderDeleteArgsSchema: z.ZodType<Prisma.PurchaseOrderDeleteArgs> = z.object({
  select: PurchaseOrderSelectSchema.optional(),
  include: PurchaseOrderIncludeSchema.optional(),
  where: PurchaseOrderWhereUniqueInputSchema,
}).strict()

export const PurchaseOrderUpdateArgsSchema: z.ZodType<Prisma.PurchaseOrderUpdateArgs> = z.object({
  select: PurchaseOrderSelectSchema.optional(),
  include: PurchaseOrderIncludeSchema.optional(),
  data: z.union([ PurchaseOrderUpdateInputSchema,PurchaseOrderUncheckedUpdateInputSchema ]),
  where: PurchaseOrderWhereUniqueInputSchema,
}).strict()

export const PurchaseOrderUpdateManyArgsSchema: z.ZodType<Prisma.PurchaseOrderUpdateManyArgs> = z.object({
  data: z.union([ PurchaseOrderUpdateManyMutationInputSchema,PurchaseOrderUncheckedUpdateManyInputSchema ]),
  where: PurchaseOrderWhereInputSchema.optional(),
}).strict()

export const PurchaseOrderDeleteManyArgsSchema: z.ZodType<Prisma.PurchaseOrderDeleteManyArgs> = z.object({
  where: PurchaseOrderWhereInputSchema.optional(),
}).strict()

export const SalesRepCreateArgsSchema: z.ZodType<Prisma.SalesRepCreateArgs> = z.object({
  select: SalesRepSelectSchema.optional(),
  include: SalesRepIncludeSchema.optional(),
  data: z.union([ SalesRepCreateInputSchema,SalesRepUncheckedCreateInputSchema ]),
}).strict()

export const SalesRepUpsertArgsSchema: z.ZodType<Prisma.SalesRepUpsertArgs> = z.object({
  select: SalesRepSelectSchema.optional(),
  include: SalesRepIncludeSchema.optional(),
  where: SalesRepWhereUniqueInputSchema,
  create: z.union([ SalesRepCreateInputSchema,SalesRepUncheckedCreateInputSchema ]),
  update: z.union([ SalesRepUpdateInputSchema,SalesRepUncheckedUpdateInputSchema ]),
}).strict()

export const SalesRepCreateManyArgsSchema: z.ZodType<Prisma.SalesRepCreateManyArgs> = z.object({
  data: z.union([ SalesRepCreateManyInputSchema,SalesRepCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const SalesRepDeleteArgsSchema: z.ZodType<Prisma.SalesRepDeleteArgs> = z.object({
  select: SalesRepSelectSchema.optional(),
  include: SalesRepIncludeSchema.optional(),
  where: SalesRepWhereUniqueInputSchema,
}).strict()

export const SalesRepUpdateArgsSchema: z.ZodType<Prisma.SalesRepUpdateArgs> = z.object({
  select: SalesRepSelectSchema.optional(),
  include: SalesRepIncludeSchema.optional(),
  data: z.union([ SalesRepUpdateInputSchema,SalesRepUncheckedUpdateInputSchema ]),
  where: SalesRepWhereUniqueInputSchema,
}).strict()

export const SalesRepUpdateManyArgsSchema: z.ZodType<Prisma.SalesRepUpdateManyArgs> = z.object({
  data: z.union([ SalesRepUpdateManyMutationInputSchema,SalesRepUncheckedUpdateManyInputSchema ]),
  where: SalesRepWhereInputSchema.optional(),
}).strict()

export const SalesRepDeleteManyArgsSchema: z.ZodType<Prisma.SalesRepDeleteManyArgs> = z.object({
  where: SalesRepWhereInputSchema.optional(),
}).strict()

export const ColorSettingsCreateArgsSchema: z.ZodType<Prisma.ColorSettingsCreateArgs> = z.object({
  select: ColorSettingsSelectSchema.optional(),
  include: ColorSettingsIncludeSchema.optional(),
  data: z.union([ ColorSettingsCreateInputSchema,ColorSettingsUncheckedCreateInputSchema ]),
}).strict()

export const ColorSettingsUpsertArgsSchema: z.ZodType<Prisma.ColorSettingsUpsertArgs> = z.object({
  select: ColorSettingsSelectSchema.optional(),
  include: ColorSettingsIncludeSchema.optional(),
  where: ColorSettingsWhereUniqueInputSchema,
  create: z.union([ ColorSettingsCreateInputSchema,ColorSettingsUncheckedCreateInputSchema ]),
  update: z.union([ ColorSettingsUpdateInputSchema,ColorSettingsUncheckedUpdateInputSchema ]),
}).strict()

export const ColorSettingsCreateManyArgsSchema: z.ZodType<Prisma.ColorSettingsCreateManyArgs> = z.object({
  data: z.union([ ColorSettingsCreateManyInputSchema,ColorSettingsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ColorSettingsDeleteArgsSchema: z.ZodType<Prisma.ColorSettingsDeleteArgs> = z.object({
  select: ColorSettingsSelectSchema.optional(),
  include: ColorSettingsIncludeSchema.optional(),
  where: ColorSettingsWhereUniqueInputSchema,
}).strict()

export const ColorSettingsUpdateArgsSchema: z.ZodType<Prisma.ColorSettingsUpdateArgs> = z.object({
  select: ColorSettingsSelectSchema.optional(),
  include: ColorSettingsIncludeSchema.optional(),
  data: z.union([ ColorSettingsUpdateInputSchema,ColorSettingsUncheckedUpdateInputSchema ]),
  where: ColorSettingsWhereUniqueInputSchema,
}).strict()

export const ColorSettingsUpdateManyArgsSchema: z.ZodType<Prisma.ColorSettingsUpdateManyArgs> = z.object({
  data: z.union([ ColorSettingsUpdateManyMutationInputSchema,ColorSettingsUncheckedUpdateManyInputSchema ]),
  where: ColorSettingsWhereInputSchema.optional(),
}).strict()

export const ColorSettingsDeleteManyArgsSchema: z.ZodType<Prisma.ColorSettingsDeleteManyArgs> = z.object({
  where: ColorSettingsWhereInputSchema.optional(),
}).strict()

export const UserSettingsCreateArgsSchema: z.ZodType<Prisma.UserSettingsCreateArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  data: z.union([ UserSettingsCreateInputSchema,UserSettingsUncheckedCreateInputSchema ]),
}).strict()

export const UserSettingsUpsertArgsSchema: z.ZodType<Prisma.UserSettingsUpsertArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereUniqueInputSchema,
  create: z.union([ UserSettingsCreateInputSchema,UserSettingsUncheckedCreateInputSchema ]),
  update: z.union([ UserSettingsUpdateInputSchema,UserSettingsUncheckedUpdateInputSchema ]),
}).strict()

export const UserSettingsCreateManyArgsSchema: z.ZodType<Prisma.UserSettingsCreateManyArgs> = z.object({
  data: z.union([ UserSettingsCreateManyInputSchema,UserSettingsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const UserSettingsDeleteArgsSchema: z.ZodType<Prisma.UserSettingsDeleteArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereUniqueInputSchema,
}).strict()

export const UserSettingsUpdateArgsSchema: z.ZodType<Prisma.UserSettingsUpdateArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  data: z.union([ UserSettingsUpdateInputSchema,UserSettingsUncheckedUpdateInputSchema ]),
  where: UserSettingsWhereUniqueInputSchema,
}).strict()

export const UserSettingsUpdateManyArgsSchema: z.ZodType<Prisma.UserSettingsUpdateManyArgs> = z.object({
  data: z.union([ UserSettingsUpdateManyMutationInputSchema,UserSettingsUncheckedUpdateManyInputSchema ]),
  where: UserSettingsWhereInputSchema.optional(),
}).strict()

export const UserSettingsDeleteManyArgsSchema: z.ZodType<Prisma.UserSettingsDeleteManyArgs> = z.object({
  where: UserSettingsWhereInputSchema.optional(),
}).strict()

export const ClientSalesRepCompanyCreateArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateArgs> = z.object({
  select: ClientSalesRepCompanySelectSchema.optional(),
  include: ClientSalesRepCompanyIncludeSchema.optional(),
  data: z.union([ ClientSalesRepCompanyCreateInputSchema,ClientSalesRepCompanyUncheckedCreateInputSchema ]),
}).strict()

export const ClientSalesRepCompanyUpsertArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpsertArgs> = z.object({
  select: ClientSalesRepCompanySelectSchema.optional(),
  include: ClientSalesRepCompanyIncludeSchema.optional(),
  where: ClientSalesRepCompanyWhereUniqueInputSchema,
  create: z.union([ ClientSalesRepCompanyCreateInputSchema,ClientSalesRepCompanyUncheckedCreateInputSchema ]),
  update: z.union([ ClientSalesRepCompanyUpdateInputSchema,ClientSalesRepCompanyUncheckedUpdateInputSchema ]),
}).strict()

export const ClientSalesRepCompanyCreateManyArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyCreateManyArgs> = z.object({
  data: z.union([ ClientSalesRepCompanyCreateManyInputSchema,ClientSalesRepCompanyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ClientSalesRepCompanyDeleteArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyDeleteArgs> = z.object({
  select: ClientSalesRepCompanySelectSchema.optional(),
  include: ClientSalesRepCompanyIncludeSchema.optional(),
  where: ClientSalesRepCompanyWhereUniqueInputSchema,
}).strict()

export const ClientSalesRepCompanyUpdateArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateArgs> = z.object({
  select: ClientSalesRepCompanySelectSchema.optional(),
  include: ClientSalesRepCompanyIncludeSchema.optional(),
  data: z.union([ ClientSalesRepCompanyUpdateInputSchema,ClientSalesRepCompanyUncheckedUpdateInputSchema ]),
  where: ClientSalesRepCompanyWhereUniqueInputSchema,
}).strict()

export const ClientSalesRepCompanyUpdateManyArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyUpdateManyArgs> = z.object({
  data: z.union([ ClientSalesRepCompanyUpdateManyMutationInputSchema,ClientSalesRepCompanyUncheckedUpdateManyInputSchema ]),
  where: ClientSalesRepCompanyWhereInputSchema.optional(),
}).strict()

export const ClientSalesRepCompanyDeleteManyArgsSchema: z.ZodType<Prisma.ClientSalesRepCompanyDeleteManyArgs> = z.object({
  where: ClientSalesRepCompanyWhereInputSchema.optional(),
}).strict()

export const ClientAddressCreateArgsSchema: z.ZodType<Prisma.ClientAddressCreateArgs> = z.object({
  select: ClientAddressSelectSchema.optional(),
  include: ClientAddressIncludeSchema.optional(),
  data: z.union([ ClientAddressCreateInputSchema,ClientAddressUncheckedCreateInputSchema ]),
}).strict()

export const ClientAddressUpsertArgsSchema: z.ZodType<Prisma.ClientAddressUpsertArgs> = z.object({
  select: ClientAddressSelectSchema.optional(),
  include: ClientAddressIncludeSchema.optional(),
  where: ClientAddressWhereUniqueInputSchema,
  create: z.union([ ClientAddressCreateInputSchema,ClientAddressUncheckedCreateInputSchema ]),
  update: z.union([ ClientAddressUpdateInputSchema,ClientAddressUncheckedUpdateInputSchema ]),
}).strict()

export const ClientAddressCreateManyArgsSchema: z.ZodType<Prisma.ClientAddressCreateManyArgs> = z.object({
  data: z.union([ ClientAddressCreateManyInputSchema,ClientAddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ClientAddressDeleteArgsSchema: z.ZodType<Prisma.ClientAddressDeleteArgs> = z.object({
  select: ClientAddressSelectSchema.optional(),
  include: ClientAddressIncludeSchema.optional(),
  where: ClientAddressWhereUniqueInputSchema,
}).strict()

export const ClientAddressUpdateArgsSchema: z.ZodType<Prisma.ClientAddressUpdateArgs> = z.object({
  select: ClientAddressSelectSchema.optional(),
  include: ClientAddressIncludeSchema.optional(),
  data: z.union([ ClientAddressUpdateInputSchema,ClientAddressUncheckedUpdateInputSchema ]),
  where: ClientAddressWhereUniqueInputSchema,
}).strict()

export const ClientAddressUpdateManyArgsSchema: z.ZodType<Prisma.ClientAddressUpdateManyArgs> = z.object({
  data: z.union([ ClientAddressUpdateManyMutationInputSchema,ClientAddressUncheckedUpdateManyInputSchema ]),
  where: ClientAddressWhereInputSchema.optional(),
}).strict()

export const ClientAddressDeleteManyArgsSchema: z.ZodType<Prisma.ClientAddressDeleteManyArgs> = z.object({
  where: ClientAddressWhereInputSchema.optional(),
}).strict()

export const ClientEmailCreateArgsSchema: z.ZodType<Prisma.ClientEmailCreateArgs> = z.object({
  select: ClientEmailSelectSchema.optional(),
  include: ClientEmailIncludeSchema.optional(),
  data: z.union([ ClientEmailCreateInputSchema,ClientEmailUncheckedCreateInputSchema ]),
}).strict()

export const ClientEmailUpsertArgsSchema: z.ZodType<Prisma.ClientEmailUpsertArgs> = z.object({
  select: ClientEmailSelectSchema.optional(),
  include: ClientEmailIncludeSchema.optional(),
  where: ClientEmailWhereUniqueInputSchema,
  create: z.union([ ClientEmailCreateInputSchema,ClientEmailUncheckedCreateInputSchema ]),
  update: z.union([ ClientEmailUpdateInputSchema,ClientEmailUncheckedUpdateInputSchema ]),
}).strict()

export const ClientEmailCreateManyArgsSchema: z.ZodType<Prisma.ClientEmailCreateManyArgs> = z.object({
  data: z.union([ ClientEmailCreateManyInputSchema,ClientEmailCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ClientEmailDeleteArgsSchema: z.ZodType<Prisma.ClientEmailDeleteArgs> = z.object({
  select: ClientEmailSelectSchema.optional(),
  include: ClientEmailIncludeSchema.optional(),
  where: ClientEmailWhereUniqueInputSchema,
}).strict()

export const ClientEmailUpdateArgsSchema: z.ZodType<Prisma.ClientEmailUpdateArgs> = z.object({
  select: ClientEmailSelectSchema.optional(),
  include: ClientEmailIncludeSchema.optional(),
  data: z.union([ ClientEmailUpdateInputSchema,ClientEmailUncheckedUpdateInputSchema ]),
  where: ClientEmailWhereUniqueInputSchema,
}).strict()

export const ClientEmailUpdateManyArgsSchema: z.ZodType<Prisma.ClientEmailUpdateManyArgs> = z.object({
  data: z.union([ ClientEmailUpdateManyMutationInputSchema,ClientEmailUncheckedUpdateManyInputSchema ]),
  where: ClientEmailWhereInputSchema.optional(),
}).strict()

export const ClientEmailDeleteManyArgsSchema: z.ZodType<Prisma.ClientEmailDeleteManyArgs> = z.object({
  where: ClientEmailWhereInputSchema.optional(),
}).strict()

export const ClientPhoneCreateArgsSchema: z.ZodType<Prisma.ClientPhoneCreateArgs> = z.object({
  select: ClientPhoneSelectSchema.optional(),
  include: ClientPhoneIncludeSchema.optional(),
  data: z.union([ ClientPhoneCreateInputSchema,ClientPhoneUncheckedCreateInputSchema ]),
}).strict()

export const ClientPhoneUpsertArgsSchema: z.ZodType<Prisma.ClientPhoneUpsertArgs> = z.object({
  select: ClientPhoneSelectSchema.optional(),
  include: ClientPhoneIncludeSchema.optional(),
  where: ClientPhoneWhereUniqueInputSchema,
  create: z.union([ ClientPhoneCreateInputSchema,ClientPhoneUncheckedCreateInputSchema ]),
  update: z.union([ ClientPhoneUpdateInputSchema,ClientPhoneUncheckedUpdateInputSchema ]),
}).strict()

export const ClientPhoneCreateManyArgsSchema: z.ZodType<Prisma.ClientPhoneCreateManyArgs> = z.object({
  data: z.union([ ClientPhoneCreateManyInputSchema,ClientPhoneCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const ClientPhoneDeleteArgsSchema: z.ZodType<Prisma.ClientPhoneDeleteArgs> = z.object({
  select: ClientPhoneSelectSchema.optional(),
  include: ClientPhoneIncludeSchema.optional(),
  where: ClientPhoneWhereUniqueInputSchema,
}).strict()

export const ClientPhoneUpdateArgsSchema: z.ZodType<Prisma.ClientPhoneUpdateArgs> = z.object({
  select: ClientPhoneSelectSchema.optional(),
  include: ClientPhoneIncludeSchema.optional(),
  data: z.union([ ClientPhoneUpdateInputSchema,ClientPhoneUncheckedUpdateInputSchema ]),
  where: ClientPhoneWhereUniqueInputSchema,
}).strict()

export const ClientPhoneUpdateManyArgsSchema: z.ZodType<Prisma.ClientPhoneUpdateManyArgs> = z.object({
  data: z.union([ ClientPhoneUpdateManyMutationInputSchema,ClientPhoneUncheckedUpdateManyInputSchema ]),
  where: ClientPhoneWhereInputSchema.optional(),
}).strict()

export const ClientPhoneDeleteManyArgsSchema: z.ZodType<Prisma.ClientPhoneDeleteManyArgs> = z.object({
  where: ClientPhoneWhereInputSchema.optional(),
}).strict()

export const CompanyCreateArgsSchema: z.ZodType<Prisma.CompanyCreateArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  data: z.union([ CompanyCreateInputSchema,CompanyUncheckedCreateInputSchema ]),
}).strict()

export const CompanyUpsertArgsSchema: z.ZodType<Prisma.CompanyUpsertArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereUniqueInputSchema,
  create: z.union([ CompanyCreateInputSchema,CompanyUncheckedCreateInputSchema ]),
  update: z.union([ CompanyUpdateInputSchema,CompanyUncheckedUpdateInputSchema ]),
}).strict()

export const CompanyCreateManyArgsSchema: z.ZodType<Prisma.CompanyCreateManyArgs> = z.object({
  data: z.union([ CompanyCreateManyInputSchema,CompanyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const CompanyDeleteArgsSchema: z.ZodType<Prisma.CompanyDeleteArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  where: CompanyWhereUniqueInputSchema,
}).strict()

export const CompanyUpdateArgsSchema: z.ZodType<Prisma.CompanyUpdateArgs> = z.object({
  select: CompanySelectSchema.optional(),
  include: CompanyIncludeSchema.optional(),
  data: z.union([ CompanyUpdateInputSchema,CompanyUncheckedUpdateInputSchema ]),
  where: CompanyWhereUniqueInputSchema,
}).strict()

export const CompanyUpdateManyArgsSchema: z.ZodType<Prisma.CompanyUpdateManyArgs> = z.object({
  data: z.union([ CompanyUpdateManyMutationInputSchema,CompanyUncheckedUpdateManyInputSchema ]),
  where: CompanyWhereInputSchema.optional(),
}).strict()

export const CompanyDeleteManyArgsSchema: z.ZodType<Prisma.CompanyDeleteManyArgs> = z.object({
  where: CompanyWhereInputSchema.optional(),
}).strict()

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict()

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict()

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict()

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict()

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict()

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict()

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
}).strict()

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
}).strict()

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict()

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema,
}).strict()

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
}).strict()

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
}).strict()

export const KeyCreateArgsSchema: z.ZodType<Prisma.KeyCreateArgs> = z.object({
  select: KeySelectSchema.optional(),
  include: KeyIncludeSchema.optional(),
  data: z.union([ KeyCreateInputSchema,KeyUncheckedCreateInputSchema ]),
}).strict()

export const KeyUpsertArgsSchema: z.ZodType<Prisma.KeyUpsertArgs> = z.object({
  select: KeySelectSchema.optional(),
  include: KeyIncludeSchema.optional(),
  where: KeyWhereUniqueInputSchema,
  create: z.union([ KeyCreateInputSchema,KeyUncheckedCreateInputSchema ]),
  update: z.union([ KeyUpdateInputSchema,KeyUncheckedUpdateInputSchema ]),
}).strict()

export const KeyCreateManyArgsSchema: z.ZodType<Prisma.KeyCreateManyArgs> = z.object({
  data: z.union([ KeyCreateManyInputSchema,KeyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict()

export const KeyDeleteArgsSchema: z.ZodType<Prisma.KeyDeleteArgs> = z.object({
  select: KeySelectSchema.optional(),
  include: KeyIncludeSchema.optional(),
  where: KeyWhereUniqueInputSchema,
}).strict()

export const KeyUpdateArgsSchema: z.ZodType<Prisma.KeyUpdateArgs> = z.object({
  select: KeySelectSchema.optional(),
  include: KeyIncludeSchema.optional(),
  data: z.union([ KeyUpdateInputSchema,KeyUncheckedUpdateInputSchema ]),
  where: KeyWhereUniqueInputSchema,
}).strict()

export const KeyUpdateManyArgsSchema: z.ZodType<Prisma.KeyUpdateManyArgs> = z.object({
  data: z.union([ KeyUpdateManyMutationInputSchema,KeyUncheckedUpdateManyInputSchema ]),
  where: KeyWhereInputSchema.optional(),
}).strict()

export const KeyDeleteManyArgsSchema: z.ZodType<Prisma.KeyDeleteManyArgs> = z.object({
  where: KeyWhereInputSchema.optional(),
}).strict()