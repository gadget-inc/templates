export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * Represents an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-encoded date string.
   * For example, September 7, 2019 is represented as `"2019-07-16"`.
   */
  Date: any;
  /**
   * Represents an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-encoded date and time string.
   * For example, 3:50 pm on September 7, 2019 in the time zone of UTC (Coordinated Universal Time) is
   * represented as `"2019-09-07T15:50:00Z`".
   */
  DateTime: any;
  /**
   * A subset of the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format that
   * includes the date and time but not the timezone which is determined from context.
   *
   * For example, "2018-01-01T00:00:00".
   */
  DateTimeWithoutTimezone: any;
  /**
   * A signed decimal number, which supports arbitrary precision and is serialized as a string.
   *
   * Example values: `"29.99"`, `"29.999"`.
   */
  Decimal: any;
  /**
   * A function-scoped handle to a refer a resource.
   * The Handle type appears in a JSON response as a String, but it is not intended to be human-readable.
   * Example value: `"10079785100"`
   */
  Handle: any;
  /**
   * A [JSON](https://www.json.org/json-en.html) object.
   *
   * Example value:
   * `{
   *   "product": {
   *     "id": "gid://shopify/Product/1346443542550",
   *     "title": "White T-shirt",
   *     "options": [{
   *       "name": "Size",
   *       "values": ["M", "L"]
   *     }]
   *   }
   * }`
   */
  JSON: any;
  /**
   * A subset of the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format that
   * includes the time but not the date or timezone which is determined from context.
   * For example, "05:43:21".
   */
  TimeWithoutTimezone: any;
  /**
   * Represents an [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) and
   * [RFC 3987](https://datatracker.ietf.org/doc/html/rfc3987)-compliant URI string.
   *
   * For example, `"https://example.myshopify.com"` is a valid URL. It includes a scheme (`https`) and a host
   * (`example.myshopify.com`).
   */
  URL: any;
  /** A void type that can be used to return a null value from a mutation. */
  Void: any;
};

/** Represents a generic custom attribute, such as whether an order is a customer's first. */
export type Attribute = {
  __typename?: 'Attribute';
  /** The key or name of the attribute. For example, `"customersFirstOrder"`. */
  key: Scalars['String'];
  /** The value of the attribute. For example, `"true"`. */
  value?: Maybe<Scalars['String']>;
};

/** Key-value pairs that contains additional information. */
export type AttributeOutput = {
  /** Key or name of the attribute. */
  key: Scalars['String'];
  /** Value of the attribute. */
  value: Scalars['String'];
};

/** Represents information about the buyer that is interacting with the cart. */
export type BuyerIdentity = {
  __typename?: 'BuyerIdentity';
  /** The customer associated with the cart. */
  customer?: Maybe<Customer>;
  /** The email address of the buyer that's interacting with the cart. */
  email?: Maybe<Scalars['String']>;
  /** Whether the buyer authenticated with a customer account. */
  isAuthenticated: Scalars['Boolean'];
  /** The phone number of the buyer that's interacting with the cart. */
  phone?: Maybe<Scalars['String']>;
  /** The purchasing company associated with the cart. */
  purchasingCompany?: Maybe<PurchasingCompany>;
};

/** A cart represents the merchandise that a buyer intends to purchase, and the cost associated with the cart. */
export type Cart = {
  __typename?: 'Cart';
  /** The attributes associated with the cart. Attributes are represented as key-value pairs. */
  attribute?: Maybe<Attribute>;
  /** Information about the buyer that is interacting with the cart. */
  buyerIdentity?: Maybe<BuyerIdentity>;
  /** A list of lines containing information about the items the customer intends to purchase. */
  lines: Array<CartLine>;
};


/** A cart represents the merchandise that a buyer intends to purchase, and the cost associated with the cart. */
export type CartAttributeArgs = {
  key?: InputMaybe<Scalars['String']>;
};

/** Represents information about the merchandise in the cart. */
export type CartLine = {
  __typename?: 'CartLine';
  /**
   * Retrieve a cart line attribute by key.
   *
   * Cart line attributes are also known as line item properties in Liquid.
   */
  attribute?: Maybe<Attribute>;
  /** The cost of the merchandise line that the buyer will pay at checkout. */
  cost: CartLineCost;
  /** The ID of the cart line. */
  id: Scalars['ID'];
  /** The merchandise that the buyer intends to purchase. */
  merchandise: Merchandise;
  /** The quantity of the merchandise that the customer intends to purchase. */
  quantity: Scalars['Int'];
  /**
   * The selling plan associated with the cart line and the effect that each
   * selling plan has on variants when they're purchased.
   */
  sellingPlanAllocation?: Maybe<SellingPlanAllocation>;
};


/** Represents information about the merchandise in the cart. */
export type CartLineAttributeArgs = {
  key?: InputMaybe<Scalars['String']>;
};

/** The cost of the merchandise line that the buyer will pay at checkout. */
export type CartLineCost = {
  __typename?: 'CartLineCost';
  /** The amount of the merchandise line. */
  amountPerQuantity: MoneyV2;
  /**
   * The compare at amount of the merchandise line. This value varies depending on
   * the buyer's identity, and is null when the value is hidden to buyers.
   */
  compareAtAmountPerQuantity?: Maybe<MoneyV2>;
  /** The cost of the merchandise line before line-level discounts. */
  subtotalAmount: MoneyV2;
  /** The total cost of the merchandise line. */
  totalAmount: MoneyV2;
};

export type CartLineInput = {
  /** The ID of the cart line. */
  cartLineId: Scalars['ID'];
  /** The quantity of the cart line to be merged.The max quantity is 2000. */
  quantity: Scalars['Int'];
};

/** An operation to apply to the Cart. */
export type CartOperation =
  /** A cart line expand operation. */
  { expand: ExpandOperation; merge?: never; update?: never; }
  |  /** A cart line merge operation. */
  { expand?: never; merge: MergeOperation; update?: never; }
  |  /** A cart line update operation. Only stores on the Shopify Plus plan can use apps with update operations. */
  { expand?: never; merge?: never; update: UpdateOperation; };

/** A customization which applies cart transformations to the merchandise lines. */
export type CartTransform = HasMetafields & {
  __typename?: 'CartTransform';
  /** Returns a metafield by namespace and key that belongs to the resource. */
  metafield?: Maybe<Metafield>;
};


/** A customization which applies cart transformations to the merchandise lines. */
export type CartTransformMetafieldArgs = {
  key: Scalars['String'];
  namespace?: InputMaybe<Scalars['String']>;
};

/** Represents whether the product is a member of the given collection. */
export type CollectionMembership = {
  __typename?: 'CollectionMembership';
  /** The ID of the collection. */
  collectionId: Scalars['ID'];
  /** Whether the product is a member of the collection. */
  isMember: Scalars['Boolean'];
};

/** Represents information about a company which is also a customer of the shop. */
export type Company = HasMetafields & {
  __typename?: 'Company';
  /** The date and time ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)) at which the company was created in Shopify. */
  createdAt: Scalars['DateTime'];
  /** A unique externally-supplied ID for the company. */
  externalId?: Maybe<Scalars['String']>;
  /** The ID of the company. */
  id: Scalars['ID'];
  /** Returns a metafield by namespace and key that belongs to the resource. */
  metafield?: Maybe<Metafield>;
  /** The name of the company. */
  name: Scalars['String'];
  /** The date and time ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)) at which the company was last modified. */
  updatedAt: Scalars['DateTime'];
};


/** Represents information about a company which is also a customer of the shop. */
export type CompanyMetafieldArgs = {
  key: Scalars['String'];
  namespace?: InputMaybe<Scalars['String']>;
};

/** A company's main point of contact. */
export type CompanyContact = {
  __typename?: 'CompanyContact';
  /**
   * The date and time ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601))
   * at which the company contact was created in Shopify.
   */
  createdAt: Scalars['DateTime'];
  /** The ID of the company. */
  id: Scalars['ID'];
  /** The company contact's locale (language). */
  locale?: Maybe<Scalars['String']>;
  /** The company contact's job title. */
  title?: Maybe<Scalars['String']>;
  /**
   * The date and time ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601))
   * at which the company contact was last modified.
   */
  updatedAt: Scalars['DateTime'];
};

/** A company's location. */
export type CompanyLocation = HasMetafields & {
  __typename?: 'CompanyLocation';
  /**
   * The date and time ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601))
   * at which the company location was created in Shopify.
   */
  createdAt: Scalars['DateTime'];
  /** A unique externally-supplied ID for the company. */
  externalId?: Maybe<Scalars['String']>;
  /** The ID of the company. */
  id: Scalars['ID'];
  /** The preferred locale of the company location. */
  locale?: Maybe<Scalars['String']>;
  /** Returns a metafield by namespace and key that belongs to the resource. */
  metafield?: Maybe<Metafield>;
  /** The name of the company location. */
  name: Scalars['String'];
  /**
   * The date and time ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601))
   * at which the company location was last modified.
   */
  updatedAt: Scalars['DateTime'];
};


/** A company's location. */
export type CompanyLocationMetafieldArgs = {
  key: Scalars['String'];
  namespace?: InputMaybe<Scalars['String']>;
};

/** A country. */
export type Country = {
  __typename?: 'Country';
  /** The ISO code of the country. */
  isoCode: CountryCode;
};

/**
 * The code designating a country/region, which generally follows ISO 3166-1 alpha-2 guidelines.
 * If a territory doesn't have a country code value in the `CountryCode` enum, then it might be considered a subdivision
 * of another country. For example, the territories associated with Spain are represented by the country code `ES`,
 * and the territories associated with the United States of America are represented by the country code `US`.
 */
export enum CountryCode {
  /** Ascension Island. */
  Ac = 'AC',
  /** Andorra. */
  Ad = 'AD',
  /** United Arab Emirates. */
  Ae = 'AE',
  /** Afghanistan. */
  Af = 'AF',
  /** Antigua & Barbuda. */
  Ag = 'AG',
  /** Anguilla. */
  Ai = 'AI',
  /** Albania. */
  Al = 'AL',
  /** Armenia. */
  Am = 'AM',
  /** Netherlands Antilles. */
  An = 'AN',
  /** Angola. */
  Ao = 'AO',
  /** Argentina. */
  Ar = 'AR',
  /** Austria. */
  At = 'AT',
  /** Australia. */
  Au = 'AU',
  /** Aruba. */
  Aw = 'AW',
  /** Åland Islands. */
  Ax = 'AX',
  /** Azerbaijan. */
  Az = 'AZ',
  /** Bosnia & Herzegovina. */
  Ba = 'BA',
  /** Barbados. */
  Bb = 'BB',
  /** Bangladesh. */
  Bd = 'BD',
  /** Belgium. */
  Be = 'BE',
  /** Burkina Faso. */
  Bf = 'BF',
  /** Bulgaria. */
  Bg = 'BG',
  /** Bahrain. */
  Bh = 'BH',
  /** Burundi. */
  Bi = 'BI',
  /** Benin. */
  Bj = 'BJ',
  /** St. Barthélemy. */
  Bl = 'BL',
  /** Bermuda. */
  Bm = 'BM',
  /** Brunei. */
  Bn = 'BN',
  /** Bolivia. */
  Bo = 'BO',
  /** Caribbean Netherlands. */
  Bq = 'BQ',
  /** Brazil. */
  Br = 'BR',
  /** Bahamas. */
  Bs = 'BS',
  /** Bhutan. */
  Bt = 'BT',
  /** Bouvet Island. */
  Bv = 'BV',
  /** Botswana. */
  Bw = 'BW',
  /** Belarus. */
  By = 'BY',
  /** Belize. */
  Bz = 'BZ',
  /** Canada. */
  Ca = 'CA',
  /** Cocos (Keeling) Islands. */
  Cc = 'CC',
  /** Congo - Kinshasa. */
  Cd = 'CD',
  /** Central African Republic. */
  Cf = 'CF',
  /** Congo - Brazzaville. */
  Cg = 'CG',
  /** Switzerland. */
  Ch = 'CH',
  /** Côte d’Ivoire. */
  Ci = 'CI',
  /** Cook Islands. */
  Ck = 'CK',
  /** Chile. */
  Cl = 'CL',
  /** Cameroon. */
  Cm = 'CM',
  /** China. */
  Cn = 'CN',
  /** Colombia. */
  Co = 'CO',
  /** Costa Rica. */
  Cr = 'CR',
  /** Cuba. */
  Cu = 'CU',
  /** Cape Verde. */
  Cv = 'CV',
  /** Curaçao. */
  Cw = 'CW',
  /** Christmas Island. */
  Cx = 'CX',
  /** Cyprus. */
  Cy = 'CY',
  /** Czechia. */
  Cz = 'CZ',
  /** Germany. */
  De = 'DE',
  /** Djibouti. */
  Dj = 'DJ',
  /** Denmark. */
  Dk = 'DK',
  /** Dominica. */
  Dm = 'DM',
  /** Dominican Republic. */
  Do = 'DO',
  /** Algeria. */
  Dz = 'DZ',
  /** Ecuador. */
  Ec = 'EC',
  /** Estonia. */
  Ee = 'EE',
  /** Egypt. */
  Eg = 'EG',
  /** Western Sahara. */
  Eh = 'EH',
  /** Eritrea. */
  Er = 'ER',
  /** Spain. */
  Es = 'ES',
  /** Ethiopia. */
  Et = 'ET',
  /** Finland. */
  Fi = 'FI',
  /** Fiji. */
  Fj = 'FJ',
  /** Falkland Islands. */
  Fk = 'FK',
  /** Faroe Islands. */
  Fo = 'FO',
  /** France. */
  Fr = 'FR',
  /** Gabon. */
  Ga = 'GA',
  /** United Kingdom. */
  Gb = 'GB',
  /** Grenada. */
  Gd = 'GD',
  /** Georgia. */
  Ge = 'GE',
  /** French Guiana. */
  Gf = 'GF',
  /** Guernsey. */
  Gg = 'GG',
  /** Ghana. */
  Gh = 'GH',
  /** Gibraltar. */
  Gi = 'GI',
  /** Greenland. */
  Gl = 'GL',
  /** Gambia. */
  Gm = 'GM',
  /** Guinea. */
  Gn = 'GN',
  /** Guadeloupe. */
  Gp = 'GP',
  /** Equatorial Guinea. */
  Gq = 'GQ',
  /** Greece. */
  Gr = 'GR',
  /** South Georgia & South Sandwich Islands. */
  Gs = 'GS',
  /** Guatemala. */
  Gt = 'GT',
  /** Guinea-Bissau. */
  Gw = 'GW',
  /** Guyana. */
  Gy = 'GY',
  /** Hong Kong SAR. */
  Hk = 'HK',
  /** Heard & McDonald Islands. */
  Hm = 'HM',
  /** Honduras. */
  Hn = 'HN',
  /** Croatia. */
  Hr = 'HR',
  /** Haiti. */
  Ht = 'HT',
  /** Hungary. */
  Hu = 'HU',
  /** Indonesia. */
  Id = 'ID',
  /** Ireland. */
  Ie = 'IE',
  /** Israel. */
  Il = 'IL',
  /** Isle of Man. */
  Im = 'IM',
  /** India. */
  In = 'IN',
  /** British Indian Ocean Territory. */
  Io = 'IO',
  /** Iraq. */
  Iq = 'IQ',
  /** Iran. */
  Ir = 'IR',
  /** Iceland. */
  Is = 'IS',
  /** Italy. */
  It = 'IT',
  /** Jersey. */
  Je = 'JE',
  /** Jamaica. */
  Jm = 'JM',
  /** Jordan. */
  Jo = 'JO',
  /** Japan. */
  Jp = 'JP',
  /** Kenya. */
  Ke = 'KE',
  /** Kyrgyzstan. */
  Kg = 'KG',
  /** Cambodia. */
  Kh = 'KH',
  /** Kiribati. */
  Ki = 'KI',
  /** Comoros. */
  Km = 'KM',
  /** St. Kitts & Nevis. */
  Kn = 'KN',
  /** North Korea. */
  Kp = 'KP',
  /** South Korea. */
  Kr = 'KR',
  /** Kuwait. */
  Kw = 'KW',
  /** Cayman Islands. */
  Ky = 'KY',
  /** Kazakhstan. */
  Kz = 'KZ',
  /** Laos. */
  La = 'LA',
  /** Lebanon. */
  Lb = 'LB',
  /** St. Lucia. */
  Lc = 'LC',
  /** Liechtenstein. */
  Li = 'LI',
  /** Sri Lanka. */
  Lk = 'LK',
  /** Liberia. */
  Lr = 'LR',
  /** Lesotho. */
  Ls = 'LS',
  /** Lithuania. */
  Lt = 'LT',
  /** Luxembourg. */
  Lu = 'LU',
  /** Latvia. */
  Lv = 'LV',
  /** Libya. */
  Ly = 'LY',
  /** Morocco. */
  Ma = 'MA',
  /** Monaco. */
  Mc = 'MC',
  /** Moldova. */
  Md = 'MD',
  /** Montenegro. */
  Me = 'ME',
  /** St. Martin. */
  Mf = 'MF',
  /** Madagascar. */
  Mg = 'MG',
  /** North Macedonia. */
  Mk = 'MK',
  /** Mali. */
  Ml = 'ML',
  /** Myanmar (Burma). */
  Mm = 'MM',
  /** Mongolia. */
  Mn = 'MN',
  /** Macao SAR. */
  Mo = 'MO',
  /** Martinique. */
  Mq = 'MQ',
  /** Mauritania. */
  Mr = 'MR',
  /** Montserrat. */
  Ms = 'MS',
  /** Malta. */
  Mt = 'MT',
  /** Mauritius. */
  Mu = 'MU',
  /** Maldives. */
  Mv = 'MV',
  /** Malawi. */
  Mw = 'MW',
  /** Mexico. */
  Mx = 'MX',
  /** Malaysia. */
  My = 'MY',
  /** Mozambique. */
  Mz = 'MZ',
  /** Namibia. */
  Na = 'NA',
  /** New Caledonia. */
  Nc = 'NC',
  /** Niger. */
  Ne = 'NE',
  /** Norfolk Island. */
  Nf = 'NF',
  /** Nigeria. */
  Ng = 'NG',
  /** Nicaragua. */
  Ni = 'NI',
  /** Netherlands. */
  Nl = 'NL',
  /** Norway. */
  No = 'NO',
  /** Nepal. */
  Np = 'NP',
  /** Nauru. */
  Nr = 'NR',
  /** Niue. */
  Nu = 'NU',
  /** New Zealand. */
  Nz = 'NZ',
  /** Oman. */
  Om = 'OM',
  /** Panama. */
  Pa = 'PA',
  /** Peru. */
  Pe = 'PE',
  /** French Polynesia. */
  Pf = 'PF',
  /** Papua New Guinea. */
  Pg = 'PG',
  /** Philippines. */
  Ph = 'PH',
  /** Pakistan. */
  Pk = 'PK',
  /** Poland. */
  Pl = 'PL',
  /** St. Pierre & Miquelon. */
  Pm = 'PM',
  /** Pitcairn Islands. */
  Pn = 'PN',
  /** Palestinian Territories. */
  Ps = 'PS',
  /** Portugal. */
  Pt = 'PT',
  /** Paraguay. */
  Py = 'PY',
  /** Qatar. */
  Qa = 'QA',
  /** Réunion. */
  Re = 'RE',
  /** Romania. */
  Ro = 'RO',
  /** Serbia. */
  Rs = 'RS',
  /** Russia. */
  Ru = 'RU',
  /** Rwanda. */
  Rw = 'RW',
  /** Saudi Arabia. */
  Sa = 'SA',
  /** Solomon Islands. */
  Sb = 'SB',
  /** Seychelles. */
  Sc = 'SC',
  /** Sudan. */
  Sd = 'SD',
  /** Sweden. */
  Se = 'SE',
  /** Singapore. */
  Sg = 'SG',
  /** St. Helena. */
  Sh = 'SH',
  /** Slovenia. */
  Si = 'SI',
  /** Svalbard & Jan Mayen. */
  Sj = 'SJ',
  /** Slovakia. */
  Sk = 'SK',
  /** Sierra Leone. */
  Sl = 'SL',
  /** San Marino. */
  Sm = 'SM',
  /** Senegal. */
  Sn = 'SN',
  /** Somalia. */
  So = 'SO',
  /** Suriname. */
  Sr = 'SR',
  /** South Sudan. */
  Ss = 'SS',
  /** São Tomé & Príncipe. */
  St = 'ST',
  /** El Salvador. */
  Sv = 'SV',
  /** Sint Maarten. */
  Sx = 'SX',
  /** Syria. */
  Sy = 'SY',
  /** Eswatini. */
  Sz = 'SZ',
  /** Tristan da Cunha. */
  Ta = 'TA',
  /** Turks & Caicos Islands. */
  Tc = 'TC',
  /** Chad. */
  Td = 'TD',
  /** French Southern Territories. */
  Tf = 'TF',
  /** Togo. */
  Tg = 'TG',
  /** Thailand. */
  Th = 'TH',
  /** Tajikistan. */
  Tj = 'TJ',
  /** Tokelau. */
  Tk = 'TK',
  /** Timor-Leste. */
  Tl = 'TL',
  /** Turkmenistan. */
  Tm = 'TM',
  /** Tunisia. */
  Tn = 'TN',
  /** Tonga. */
  To = 'TO',
  /** Türkiye. */
  Tr = 'TR',
  /** Trinidad & Tobago. */
  Tt = 'TT',
  /** Tuvalu. */
  Tv = 'TV',
  /** Taiwan. */
  Tw = 'TW',
  /** Tanzania. */
  Tz = 'TZ',
  /** Ukraine. */
  Ua = 'UA',
  /** Uganda. */
  Ug = 'UG',
  /** U.S. Outlying Islands. */
  Um = 'UM',
  /** United States. */
  Us = 'US',
  /** Uruguay. */
  Uy = 'UY',
  /** Uzbekistan. */
  Uz = 'UZ',
  /** Vatican City. */
  Va = 'VA',
  /** St. Vincent & Grenadines. */
  Vc = 'VC',
  /** Venezuela. */
  Ve = 'VE',
  /** British Virgin Islands. */
  Vg = 'VG',
  /** Vietnam. */
  Vn = 'VN',
  /** Vanuatu. */
  Vu = 'VU',
  /** Wallis & Futuna. */
  Wf = 'WF',
  /** Samoa. */
  Ws = 'WS',
  /** Kosovo. */
  Xk = 'XK',
  /** Yemen. */
  Ye = 'YE',
  /** Mayotte. */
  Yt = 'YT',
  /** South Africa. */
  Za = 'ZA',
  /** Zambia. */
  Zm = 'ZM',
  /** Zimbabwe. */
  Zw = 'ZW',
  /** Unknown Region. */
  Zz = 'ZZ'
}

/**
 * The three-letter currency codes that represent the world currencies used in
 * stores. These include standard ISO 4217 codes, legacy codes,
 * and non-standard codes.
 */
export enum CurrencyCode {
  /** United Arab Emirates Dirham (AED). */
  Aed = 'AED',
  /** Afghan Afghani (AFN). */
  Afn = 'AFN',
  /** Albanian Lek (ALL). */
  All = 'ALL',
  /** Armenian Dram (AMD). */
  Amd = 'AMD',
  /** Netherlands Antillean Guilder. */
  Ang = 'ANG',
  /** Angolan Kwanza (AOA). */
  Aoa = 'AOA',
  /** Argentine Pesos (ARS). */
  Ars = 'ARS',
  /** Australian Dollars (AUD). */
  Aud = 'AUD',
  /** Aruban Florin (AWG). */
  Awg = 'AWG',
  /** Azerbaijani Manat (AZN). */
  Azn = 'AZN',
  /** Bosnia and Herzegovina Convertible Mark (BAM). */
  Bam = 'BAM',
  /** Barbadian Dollar (BBD). */
  Bbd = 'BBD',
  /** Bangladesh Taka (BDT). */
  Bdt = 'BDT',
  /** Bulgarian Lev (BGN). */
  Bgn = 'BGN',
  /** Bahraini Dinar (BHD). */
  Bhd = 'BHD',
  /** Burundian Franc (BIF). */
  Bif = 'BIF',
  /** Bermudian Dollar (BMD). */
  Bmd = 'BMD',
  /** Brunei Dollar (BND). */
  Bnd = 'BND',
  /** Bolivian Boliviano (BOB). */
  Bob = 'BOB',
  /** Brazilian Real (BRL). */
  Brl = 'BRL',
  /** Bahamian Dollar (BSD). */
  Bsd = 'BSD',
  /** Bhutanese Ngultrum (BTN). */
  Btn = 'BTN',
  /** Botswana Pula (BWP). */
  Bwp = 'BWP',
  /** Belarusian Ruble (BYN). */
  Byn = 'BYN',
  /**
   * Belarusian Ruble (BYR).
   * @deprecated `BYR` is deprecated. Use `BYN` available from version `2021-01` onwards instead.
   */
  Byr = 'BYR',
  /** Belize Dollar (BZD). */
  Bzd = 'BZD',
  /** Canadian Dollars (CAD). */
  Cad = 'CAD',
  /** Congolese franc (CDF). */
  Cdf = 'CDF',
  /** Swiss Francs (CHF). */
  Chf = 'CHF',
  /** Chilean Peso (CLP). */
  Clp = 'CLP',
  /** Chinese Yuan Renminbi (CNY). */
  Cny = 'CNY',
  /** Colombian Peso (COP). */
  Cop = 'COP',
  /** Costa Rican Colones (CRC). */
  Crc = 'CRC',
  /** Cape Verdean escudo (CVE). */
  Cve = 'CVE',
  /** Czech Koruny (CZK). */
  Czk = 'CZK',
  /** Djiboutian Franc (DJF). */
  Djf = 'DJF',
  /** Danish Kroner (DKK). */
  Dkk = 'DKK',
  /** Dominican Peso (DOP). */
  Dop = 'DOP',
  /** Algerian Dinar (DZD). */
  Dzd = 'DZD',
  /** Egyptian Pound (EGP). */
  Egp = 'EGP',
  /** Eritrean Nakfa (ERN). */
  Ern = 'ERN',
  /** Ethiopian Birr (ETB). */
  Etb = 'ETB',
  /** Euro (EUR). */
  Eur = 'EUR',
  /** Fijian Dollars (FJD). */
  Fjd = 'FJD',
  /** Falkland Islands Pounds (FKP). */
  Fkp = 'FKP',
  /** United Kingdom Pounds (GBP). */
  Gbp = 'GBP',
  /** Georgian Lari (GEL). */
  Gel = 'GEL',
  /** Ghanaian Cedi (GHS). */
  Ghs = 'GHS',
  /** Gibraltar Pounds (GIP). */
  Gip = 'GIP',
  /** Gambian Dalasi (GMD). */
  Gmd = 'GMD',
  /** Guinean Franc (GNF). */
  Gnf = 'GNF',
  /** Guatemalan Quetzal (GTQ). */
  Gtq = 'GTQ',
  /** Guyanese Dollar (GYD). */
  Gyd = 'GYD',
  /** Hong Kong Dollars (HKD). */
  Hkd = 'HKD',
  /** Honduran Lempira (HNL). */
  Hnl = 'HNL',
  /** Croatian Kuna (HRK). */
  Hrk = 'HRK',
  /** Haitian Gourde (HTG). */
  Htg = 'HTG',
  /** Hungarian Forint (HUF). */
  Huf = 'HUF',
  /** Indonesian Rupiah (IDR). */
  Idr = 'IDR',
  /** Israeli New Shekel (NIS). */
  Ils = 'ILS',
  /** Indian Rupees (INR). */
  Inr = 'INR',
  /** Iraqi Dinar (IQD). */
  Iqd = 'IQD',
  /** Iranian Rial (IRR). */
  Irr = 'IRR',
  /** Icelandic Kronur (ISK). */
  Isk = 'ISK',
  /** Jersey Pound. */
  Jep = 'JEP',
  /** Jamaican Dollars (JMD). */
  Jmd = 'JMD',
  /** Jordanian Dinar (JOD). */
  Jod = 'JOD',
  /** Japanese Yen (JPY). */
  Jpy = 'JPY',
  /** Kenyan Shilling (KES). */
  Kes = 'KES',
  /** Kyrgyzstani Som (KGS). */
  Kgs = 'KGS',
  /** Cambodian Riel. */
  Khr = 'KHR',
  /** Kiribati Dollar (KID). */
  Kid = 'KID',
  /** Comorian Franc (KMF). */
  Kmf = 'KMF',
  /** South Korean Won (KRW). */
  Krw = 'KRW',
  /** Kuwaiti Dinar (KWD). */
  Kwd = 'KWD',
  /** Cayman Dollars (KYD). */
  Kyd = 'KYD',
  /** Kazakhstani Tenge (KZT). */
  Kzt = 'KZT',
  /** Laotian Kip (LAK). */
  Lak = 'LAK',
  /** Lebanese Pounds (LBP). */
  Lbp = 'LBP',
  /** Sri Lankan Rupees (LKR). */
  Lkr = 'LKR',
  /** Liberian Dollar (LRD). */
  Lrd = 'LRD',
  /** Lesotho Loti (LSL). */
  Lsl = 'LSL',
  /** Lithuanian Litai (LTL). */
  Ltl = 'LTL',
  /** Latvian Lati (LVL). */
  Lvl = 'LVL',
  /** Libyan Dinar (LYD). */
  Lyd = 'LYD',
  /** Moroccan Dirham. */
  Mad = 'MAD',
  /** Moldovan Leu (MDL). */
  Mdl = 'MDL',
  /** Malagasy Ariary (MGA). */
  Mga = 'MGA',
  /** Macedonia Denar (MKD). */
  Mkd = 'MKD',
  /** Burmese Kyat (MMK). */
  Mmk = 'MMK',
  /** Mongolian Tugrik. */
  Mnt = 'MNT',
  /** Macanese Pataca (MOP). */
  Mop = 'MOP',
  /** Mauritanian Ouguiya (MRU). */
  Mru = 'MRU',
  /** Mauritian Rupee (MUR). */
  Mur = 'MUR',
  /** Maldivian Rufiyaa (MVR). */
  Mvr = 'MVR',
  /** Malawian Kwacha (MWK). */
  Mwk = 'MWK',
  /** Mexican Pesos (MXN). */
  Mxn = 'MXN',
  /** Malaysian Ringgits (MYR). */
  Myr = 'MYR',
  /** Mozambican Metical. */
  Mzn = 'MZN',
  /** Namibian Dollar. */
  Nad = 'NAD',
  /** Nigerian Naira (NGN). */
  Ngn = 'NGN',
  /** Nicaraguan Córdoba (NIO). */
  Nio = 'NIO',
  /** Norwegian Kroner (NOK). */
  Nok = 'NOK',
  /** Nepalese Rupee (NPR). */
  Npr = 'NPR',
  /** New Zealand Dollars (NZD). */
  Nzd = 'NZD',
  /** Omani Rial (OMR). */
  Omr = 'OMR',
  /** Panamian Balboa (PAB). */
  Pab = 'PAB',
  /** Peruvian Nuevo Sol (PEN). */
  Pen = 'PEN',
  /** Papua New Guinean Kina (PGK). */
  Pgk = 'PGK',
  /** Philippine Peso (PHP). */
  Php = 'PHP',
  /** Pakistani Rupee (PKR). */
  Pkr = 'PKR',
  /** Polish Zlotych (PLN). */
  Pln = 'PLN',
  /** Paraguayan Guarani (PYG). */
  Pyg = 'PYG',
  /** Qatari Rial (QAR). */
  Qar = 'QAR',
  /** Romanian Lei (RON). */
  Ron = 'RON',
  /** Serbian dinar (RSD). */
  Rsd = 'RSD',
  /** Russian Rubles (RUB). */
  Rub = 'RUB',
  /** Rwandan Franc (RWF). */
  Rwf = 'RWF',
  /** Saudi Riyal (SAR). */
  Sar = 'SAR',
  /** Solomon Islands Dollar (SBD). */
  Sbd = 'SBD',
  /** Seychellois Rupee (SCR). */
  Scr = 'SCR',
  /** Sudanese Pound (SDG). */
  Sdg = 'SDG',
  /** Swedish Kronor (SEK). */
  Sek = 'SEK',
  /** Singapore Dollars (SGD). */
  Sgd = 'SGD',
  /** Saint Helena Pounds (SHP). */
  Shp = 'SHP',
  /** Sierra Leonean Leone (SLL). */
  Sll = 'SLL',
  /** Somali Shilling (SOS). */
  Sos = 'SOS',
  /** Surinamese Dollar (SRD). */
  Srd = 'SRD',
  /** South Sudanese Pound (SSP). */
  Ssp = 'SSP',
  /**
   * Sao Tome And Principe Dobra (STD).
   * @deprecated `STD` is deprecated. Use `STN` available from version `2022-07` onwards instead.
   */
  Std = 'STD',
  /** Sao Tome And Principe Dobra (STN). */
  Stn = 'STN',
  /** Syrian Pound (SYP). */
  Syp = 'SYP',
  /** Swazi Lilangeni (SZL). */
  Szl = 'SZL',
  /** Thai baht (THB). */
  Thb = 'THB',
  /** Tajikistani Somoni (TJS). */
  Tjs = 'TJS',
  /** Turkmenistani Manat (TMT). */
  Tmt = 'TMT',
  /** Tunisian Dinar (TND). */
  Tnd = 'TND',
  /** Tongan Pa'anga (TOP). */
  Top = 'TOP',
  /** Turkish Lira (TRY). */
  Try = 'TRY',
  /** Trinidad and Tobago Dollars (TTD). */
  Ttd = 'TTD',
  /** Taiwan Dollars (TWD). */
  Twd = 'TWD',
  /** Tanzanian Shilling (TZS). */
  Tzs = 'TZS',
  /** Ukrainian Hryvnia (UAH). */
  Uah = 'UAH',
  /** Ugandan Shilling (UGX). */
  Ugx = 'UGX',
  /** United States Dollars (USD). */
  Usd = 'USD',
  /** Uruguayan Pesos (UYU). */
  Uyu = 'UYU',
  /** Uzbekistan som (UZS). */
  Uzs = 'UZS',
  /** Venezuelan Bolivares (VED). */
  Ved = 'VED',
  /**
   * Venezuelan Bolivares (VEF).
   * @deprecated `VEF` is deprecated. Use `VES` available from version `2020-10` onwards instead.
   */
  Vef = 'VEF',
  /** Venezuelan Bolivares Soberanos (VES). */
  Ves = 'VES',
  /** Vietnamese đồng (VND). */
  Vnd = 'VND',
  /** Vanuatu Vatu (VUV). */
  Vuv = 'VUV',
  /** Samoan Tala (WST). */
  Wst = 'WST',
  /** Central African CFA Franc (XAF). */
  Xaf = 'XAF',
  /** East Caribbean Dollar (XCD). */
  Xcd = 'XCD',
  /** West African CFA franc (XOF). */
  Xof = 'XOF',
  /** CFP Franc (XPF). */
  Xpf = 'XPF',
  /** Unrecognized currency. */
  Xxx = 'XXX',
  /** Yemeni Rial (YER). */
  Yer = 'YER',
  /** South African Rand (ZAR). */
  Zar = 'ZAR',
  /** Zambian Kwacha (ZMW). */
  Zmw = 'ZMW'
}

/** A custom product. */
export type CustomProduct = {
  __typename?: 'CustomProduct';
  /** Whether the merchandise is a gift card. */
  isGiftCard: Scalars['Boolean'];
  /** Whether the merchandise requires shipping. */
  requiresShipping: Scalars['Boolean'];
  /** The localized title of the product in the customer’s locale. */
  title: Scalars['String'];
  /** The weight of the product variant in the unit system specified with `weight_unit`. */
  weight?: Maybe<Scalars['Float']>;
  /** Unit of measurement for weight. */
  weightUnit: WeightUnit;
};

/** Represents a customer with the shop. */
export type Customer = HasMetafields & {
  __typename?: 'Customer';
  /**
   * The total amount of money spent by the customer. Converted from the shop's
   * currency to the currency of the cart using a market rate.
   */
  amountSpent: MoneyV2;
  /** The customer’s name, email or phone number. */
  displayName: Scalars['String'];
  /** The customer’s email address. */
  email?: Maybe<Scalars['String']>;
  /** The customer's first name. */
  firstName?: Maybe<Scalars['String']>;
  /** Whether the customer has any of the given tags. */
  hasAnyTag: Scalars['Boolean'];
  /** Whether the customer has the given tags. */
  hasTags: Array<HasTagResponse>;
  /** A unique identifier for the customer. */
  id: Scalars['ID'];
  /** The customer's last name. */
  lastName?: Maybe<Scalars['String']>;
  /** Returns a metafield by namespace and key that belongs to the resource. */
  metafield?: Maybe<Metafield>;
  /** The number of orders made by the customer. */
  numberOfOrders: Scalars['Int'];
};


/** Represents a customer with the shop. */
export type CustomerHasAnyTagArgs = {
  tags?: Array<Scalars['String']>;
};


/** Represents a customer with the shop. */
export type CustomerHasTagsArgs = {
  tags?: Array<Scalars['String']>;
};


/** Represents a customer with the shop. */
export type CustomerMetafieldArgs = {
  key: Scalars['String'];
  namespace?: InputMaybe<Scalars['String']>;
};

/** A cart line expand operation. */
export type ExpandOperation = {
  /** The cart line id to expand. */
  cartLineId: Scalars['ID'];
  /** The cart items to expand. */
  expandedCartItems: Array<ExpandedItem>;
  /** The image of the group. */
  image?: InputMaybe<ImageInput>;
  /** The price adjustment to the group. */
  price?: InputMaybe<PriceAdjustment>;
  /** Title override. If title is not provided, variant title is used. */
  title?: InputMaybe<Scalars['String']>;
};

export type ExpandedItem = {
  /** The CartLine attributes to be added to component line. */
  attributes?: InputMaybe<Array<AttributeOutput>>;
  /** The merchandise id of the expanded item. */
  merchandiseId: Scalars['ID'];
  /** The price adjustment for the expanded item. */
  price?: InputMaybe<ExpandedItemPriceAdjustment>;
  /** The quantity of the expanded item.The max quantity is 2000. */
  quantity: Scalars['Int'];
};

/** A fixed price per unit adjustment to apply to the expanded item. */
export type ExpandedItemFixedPricePerUnitAdjustment = {
  /** The fixed price amount per quantity of the expanded item in presentment currency. */
  amount: Scalars['Decimal'];
};

/** A price adjustment to apply to the expanded item. */
export type ExpandedItemPriceAdjustment = {
  /** The price adjustment for the expanded item. */
  adjustment: ExpandedItemPriceAdjustmentValue;
};

/** A price adjustment to apply to a cart line. */
export type ExpandedItemPriceAdjustmentValue =
  /** A fixed price per unit adjustment to apply to the expanded item. */
  { fixedPricePerUnit: ExpandedItemFixedPricePerUnitAdjustment; };

/** The run target result. In API versions 2023-10 and beyond, this type is deprecated in favor of `FunctionRunResult`. */
export type FunctionResult = {
  /** Cart operations to run on Cart. */
  operations: Array<CartOperation>;
};

/** The run target result. */
export type FunctionRunResult = {
  /** Cart operations to run on Cart. */
  operations: Array<CartOperation>;
};

/** Represents information about the metafields associated to the specified resource. */
export type HasMetafields = {
  /** Returns a metafield by namespace and key that belongs to the resource. */
  metafield?: Maybe<Metafield>;
};


/** Represents information about the metafields associated to the specified resource. */
export type HasMetafieldsMetafieldArgs = {
  key: Scalars['String'];
  namespace?: InputMaybe<Scalars['String']>;
};

/** Represents whether the current object has the given tag. */
export type HasTagResponse = {
  __typename?: 'HasTagResponse';
  /** Whether the current object has the tag. */
  hasTag: Scalars['Boolean'];
  /** The tag. */
  tag: Scalars['String'];
};

/** The image of an object. */
export type ImageInput = {
  /** The URL of the image. */
  url: Scalars['URL'];
};

export type Input = {
  __typename?: 'Input';
  /** The cart. */
  cart: Cart;
  /** The CartTransform containing the function. */
  cartTransform: CartTransform;
  /** The localization of the Function execution context. */
  localization: Localization;
  /** The conversion rate between the shop's currency and the currency of the cart. */
  presentmentCurrencyRate: Scalars['Decimal'];
  /** Information about the shop. */
  shop: Shop;
};

/** A language. */
export type Language = {
  __typename?: 'Language';
  /** The ISO code. */
  isoCode: LanguageCode;
};

/** Language codes supported by Shopify. */
export enum LanguageCode {
  /** Afrikaans. */
  Af = 'AF',
  /** Akan. */
  Ak = 'AK',
  /** Amharic. */
  Am = 'AM',
  /** Arabic. */
  Ar = 'AR',
  /** Assamese. */
  As = 'AS',
  /** Azerbaijani. */
  Az = 'AZ',
  /** Belarusian. */
  Be = 'BE',
  /** Bulgarian. */
  Bg = 'BG',
  /** Bambara. */
  Bm = 'BM',
  /** Bangla. */
  Bn = 'BN',
  /** Tibetan. */
  Bo = 'BO',
  /** Breton. */
  Br = 'BR',
  /** Bosnian. */
  Bs = 'BS',
  /** Catalan. */
  Ca = 'CA',
  /** Chechen. */
  Ce = 'CE',
  /** Central Kurdish. */
  Ckb = 'CKB',
  /** Czech. */
  Cs = 'CS',
  /** Church Slavic. */
  Cu = 'CU',
  /** Welsh. */
  Cy = 'CY',
  /** Danish. */
  Da = 'DA',
  /** German. */
  De = 'DE',
  /** Dzongkha. */
  Dz = 'DZ',
  /** Ewe. */
  Ee = 'EE',
  /** Greek. */
  El = 'EL',
  /** English. */
  En = 'EN',
  /** Esperanto. */
  Eo = 'EO',
  /** Spanish. */
  Es = 'ES',
  /** Estonian. */
  Et = 'ET',
  /** Basque. */
  Eu = 'EU',
  /** Persian. */
  Fa = 'FA',
  /** Fulah. */
  Ff = 'FF',
  /** Finnish. */
  Fi = 'FI',
  /** Filipino. */
  Fil = 'FIL',
  /** Faroese. */
  Fo = 'FO',
  /** French. */
  Fr = 'FR',
  /** Western Frisian. */
  Fy = 'FY',
  /** Irish. */
  Ga = 'GA',
  /** Scottish Gaelic. */
  Gd = 'GD',
  /** Galician. */
  Gl = 'GL',
  /** Gujarati. */
  Gu = 'GU',
  /** Manx. */
  Gv = 'GV',
  /** Hausa. */
  Ha = 'HA',
  /** Hebrew. */
  He = 'HE',
  /** Hindi. */
  Hi = 'HI',
  /** Croatian. */
  Hr = 'HR',
  /** Hungarian. */
  Hu = 'HU',
  /** Armenian. */
  Hy = 'HY',
  /** Interlingua. */
  Ia = 'IA',
  /** Indonesian. */
  Id = 'ID',
  /** Igbo. */
  Ig = 'IG',
  /** Sichuan Yi. */
  Ii = 'II',
  /** Icelandic. */
  Is = 'IS',
  /** Italian. */
  It = 'IT',
  /** Japanese. */
  Ja = 'JA',
  /** Javanese. */
  Jv = 'JV',
  /** Georgian. */
  Ka = 'KA',
  /** Kikuyu. */
  Ki = 'KI',
  /** Kazakh. */
  Kk = 'KK',
  /** Kalaallisut. */
  Kl = 'KL',
  /** Khmer. */
  Km = 'KM',
  /** Kannada. */
  Kn = 'KN',
  /** Korean. */
  Ko = 'KO',
  /** Kashmiri. */
  Ks = 'KS',
  /** Kurdish. */
  Ku = 'KU',
  /** Cornish. */
  Kw = 'KW',
  /** Kyrgyz. */
  Ky = 'KY',
  /** Luxembourgish. */
  Lb = 'LB',
  /** Ganda. */
  Lg = 'LG',
  /** Lingala. */
  Ln = 'LN',
  /** Lao. */
  Lo = 'LO',
  /** Lithuanian. */
  Lt = 'LT',
  /** Luba-Katanga. */
  Lu = 'LU',
  /** Latvian. */
  Lv = 'LV',
  /** Malagasy. */
  Mg = 'MG',
  /** Māori. */
  Mi = 'MI',
  /** Macedonian. */
  Mk = 'MK',
  /** Malayalam. */
  Ml = 'ML',
  /** Mongolian. */
  Mn = 'MN',
  /** Marathi. */
  Mr = 'MR',
  /** Malay. */
  Ms = 'MS',
  /** Maltese. */
  Mt = 'MT',
  /** Burmese. */
  My = 'MY',
  /** Norwegian (Bokmål). */
  Nb = 'NB',
  /** North Ndebele. */
  Nd = 'ND',
  /** Nepali. */
  Ne = 'NE',
  /** Dutch. */
  Nl = 'NL',
  /** Norwegian Nynorsk. */
  Nn = 'NN',
  /** Norwegian. */
  No = 'NO',
  /** Oromo. */
  Om = 'OM',
  /** Odia. */
  Or = 'OR',
  /** Ossetic. */
  Os = 'OS',
  /** Punjabi. */
  Pa = 'PA',
  /** Polish. */
  Pl = 'PL',
  /** Pashto. */
  Ps = 'PS',
  /** Portuguese. */
  Pt = 'PT',
  /** Portuguese (Brazil). */
  PtBr = 'PT_BR',
  /** Portuguese (Portugal). */
  PtPt = 'PT_PT',
  /** Quechua. */
  Qu = 'QU',
  /** Romansh. */
  Rm = 'RM',
  /** Rundi. */
  Rn = 'RN',
  /** Romanian. */
  Ro = 'RO',
  /** Russian. */
  Ru = 'RU',
  /** Kinyarwanda. */
  Rw = 'RW',
  /** Sanskrit. */
  Sa = 'SA',
  /** Sardinian. */
  Sc = 'SC',
  /** Sindhi. */
  Sd = 'SD',
  /** Northern Sami. */
  Se = 'SE',
  /** Sango. */
  Sg = 'SG',
  /** Sinhala. */
  Si = 'SI',
  /** Slovak. */
  Sk = 'SK',
  /** Slovenian. */
  Sl = 'SL',
  /** Shona. */
  Sn = 'SN',
  /** Somali. */
  So = 'SO',
  /** Albanian. */
  Sq = 'SQ',
  /** Serbian. */
  Sr = 'SR',
  /** Sundanese. */
  Su = 'SU',
  /** Swedish. */
  Sv = 'SV',
  /** Swahili. */
  Sw = 'SW',
  /** Tamil. */
  Ta = 'TA',
  /** Telugu. */
  Te = 'TE',
  /** Tajik. */
  Tg = 'TG',
  /** Thai. */
  Th = 'TH',
  /** Tigrinya. */
  Ti = 'TI',
  /** Turkmen. */
  Tk = 'TK',
  /** Tongan. */
  To = 'TO',
  /** Turkish. */
  Tr = 'TR',
  /** Tatar. */
  Tt = 'TT',
  /** Uyghur. */
  Ug = 'UG',
  /** Ukrainian. */
  Uk = 'UK',
  /** Urdu. */
  Ur = 'UR',
  /** Uzbek. */
  Uz = 'UZ',
  /** Vietnamese. */
  Vi = 'VI',
  /** Volapük. */
  Vo = 'VO',
  /** Wolof. */
  Wo = 'WO',
  /** Xhosa. */
  Xh = 'XH',
  /** Yiddish. */
  Yi = 'YI',
  /** Yoruba. */
  Yo = 'YO',
  /** Chinese. */
  Zh = 'ZH',
  /** Chinese (Simplified). */
  ZhCn = 'ZH_CN',
  /** Chinese (Traditional). */
  ZhTw = 'ZH_TW',
  /** Zulu. */
  Zu = 'ZU'
}

/** Represents limited information about the current time relative to the parent object. */
export type LocalTime = {
  __typename?: 'LocalTime';
  /** The current date relative to the parent object. */
  date: Scalars['Date'];
  /** Returns true if the current date and time is at or past the given date and time, and false otherwise. */
  dateTimeAfter: Scalars['Boolean'];
  /** Returns true if the current date and time is before the given date and time, and false otherwise. */
  dateTimeBefore: Scalars['Boolean'];
  /** Returns true if the current date and time is between the two given date and times, and false otherwise. */
  dateTimeBetween: Scalars['Boolean'];
  /** Returns true if the current time is at or past the given time, and false otherwise. */
  timeAfter: Scalars['Boolean'];
  /** Returns true if the current time is at or past the given time, and false otherwise. */
  timeBefore: Scalars['Boolean'];
  /** Returns true if the current time is between the two given times, and false otherwise. */
  timeBetween: Scalars['Boolean'];
};


/** Represents limited information about the current time relative to the parent object. */
export type LocalTimeDateTimeAfterArgs = {
  dateTime: Scalars['DateTimeWithoutTimezone'];
};


/** Represents limited information about the current time relative to the parent object. */
export type LocalTimeDateTimeBeforeArgs = {
  dateTime: Scalars['DateTimeWithoutTimezone'];
};


/** Represents limited information about the current time relative to the parent object. */
export type LocalTimeDateTimeBetweenArgs = {
  endDateTime: Scalars['DateTimeWithoutTimezone'];
  startDateTime: Scalars['DateTimeWithoutTimezone'];
};


/** Represents limited information about the current time relative to the parent object. */
export type LocalTimeTimeAfterArgs = {
  time: Scalars['TimeWithoutTimezone'];
};


/** Represents limited information about the current time relative to the parent object. */
export type LocalTimeTimeBeforeArgs = {
  time: Scalars['TimeWithoutTimezone'];
};


/** Represents limited information about the current time relative to the parent object. */
export type LocalTimeTimeBetweenArgs = {
  endTime: Scalars['TimeWithoutTimezone'];
  startTime: Scalars['TimeWithoutTimezone'];
};

/** Information about the localized experiences configured for the shop. */
export type Localization = {
  __typename?: 'Localization';
  /** The country of the active localized experience. */
  country: Country;
  /** The language of the active localized experience. */
  language: Language;
  /** The market of the active localized experience. */
  market: Market;
};

/**
 * A market is a group of one or more regions that you want to target for international sales.
 * By creating a market, you can configure a distinct, localized shopping experience for
 * customers from a specific area of the world. For example, you can
 * [change currency](https://shopify.dev/api/admin-graphql/current/mutations/marketCurrencySettingsUpdate),
 * [configure international pricing](https://shopify.dev/api/examples/product-price-lists),
 * or [add market-specific domains or subfolders](https://shopify.dev/api/admin-graphql/current/objects/MarketWebPresence).
 */
export type Market = HasMetafields & {
  __typename?: 'Market';
  /** A human-readable unique string for the market automatically generated from its title. */
  handle: Scalars['Handle'];
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** Returns a metafield by namespace and key that belongs to the resource. */
  metafield?: Maybe<Metafield>;
  /** A geographic region which comprises a market. */
  regions: Array<MarketRegion>;
};


/**
 * A market is a group of one or more regions that you want to target for international sales.
 * By creating a market, you can configure a distinct, localized shopping experience for
 * customers from a specific area of the world. For example, you can
 * [change currency](https://shopify.dev/api/admin-graphql/current/mutations/marketCurrencySettingsUpdate),
 * [configure international pricing](https://shopify.dev/api/examples/product-price-lists),
 * or [add market-specific domains or subfolders](https://shopify.dev/api/admin-graphql/current/objects/MarketWebPresence).
 */
export type MarketMetafieldArgs = {
  key: Scalars['String'];
  namespace?: InputMaybe<Scalars['String']>;
};

/** Represents a region. */
export type MarketRegion = {
  /** The name of the region in the language of the current localization. */
  name?: Maybe<Scalars['String']>;
};

/** A country which comprises a market. */
export type MarketRegionCountry = MarketRegion & {
  __typename?: 'MarketRegionCountry';
  /** The two-letter code for the country. */
  code: CountryCode;
  /** The country name in the language of the current localization. */
  name: Scalars['String'];
};

/** The merchandise to be purchased at checkout. */
export type Merchandise = CustomProduct | ProductVariant;

/** A cart line merge operation. */
export type MergeOperation = {
  /** The CartLine attributes to be added to the parent line. */
  attributes?: InputMaybe<Array<AttributeOutput>>;
  /** The list of cart lines to merge. */
  cartLines: Array<CartLineInput>;
  /** The image of the group. */
  image?: InputMaybe<ImageInput>;
  /** The product variant that models the group of lines. */
  parentVariantId: Scalars['ID'];
  /** The price adjustment to the group. */
  price?: InputMaybe<PriceAdjustment>;
  /** The name of the group of lines to merge. If it isn't specified, it will use the parent_variant' name. */
  title?: InputMaybe<Scalars['String']>;
};

/**
 * [Metafields](https://shopify.dev/apps/metafields)
 * enable you to attach additional information to a
 * Shopify resource, such as a [Product](https://shopify.dev/api/admin-graphql/latest/objects/product)
 * or a [Collection](https://shopify.dev/api/admin-graphql/latest/objects/collection).
 * For more information about the Shopify resources that you can attach metafields to, refer to
 * [HasMetafields](https://shopify.dev/api/admin/graphql/reference/common-objects/HasMetafields).
 */
export type Metafield = {
  __typename?: 'Metafield';
  /** The data stored in the metafield in JSON format. */
  jsonValue: Scalars['JSON'];
  /**
   * The type of data that the metafield stores in the `value` field.
   * Refer to the list of [supported types](https://shopify.dev/apps/metafields/types).
   */
  type: Scalars['String'];
  /** The data stored in the metafield. Always stored as a string, regardless of the metafield's type. */
  value: Scalars['String'];
};

/** A monetary value with currency. */
export type MoneyV2 = {
  __typename?: 'MoneyV2';
  /** Decimal money amount. */
  amount: Scalars['Decimal'];
  /** Currency of the money. */
  currencyCode: CurrencyCode;
};

/** The root mutation for the API. */
export type MutationRoot = {
  __typename?: 'MutationRoot';
  /**
   * Handles the Function result.
   * @deprecated Use the target-specific field instead.
   */
  handleResult: Scalars['Void'];
  /** Handles the Function result for the purchase.cart-transform.run target. */
  run: Scalars['Void'];
};


/** The root mutation for the API. */
export type MutationRootHandleResultArgs = {
  result: FunctionResult;
};


/** The root mutation for the API. */
export type MutationRootRunArgs = {
  result: FunctionRunResult;
};

export type PriceAdjustment = {
  /** The percentage price decrease of the price adjustment. */
  percentageDecrease?: InputMaybe<PriceAdjustmentValue>;
};

export type PriceAdjustmentValue = {
  /** The value of the price adjustment. */
  value: Scalars['Decimal'];
};

/** Represents a product. */
export type Product = HasMetafields & {
  __typename?: 'Product';
  /** A unique human-friendly string of the product's title. */
  handle: Scalars['Handle'];
  /** Whether the product has any of the given tags. */
  hasAnyTag: Scalars['Boolean'];
  /** Whether the product has the given tags. */
  hasTags: Array<HasTagResponse>;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** Whether the product is in any of the given collections. */
  inAnyCollection: Scalars['Boolean'];
  /** Whether the product is in the given collections. */
  inCollections: Array<CollectionMembership>;
  /** Whether the product is a gift card. */
  isGiftCard: Scalars['Boolean'];
  /** Returns a metafield by namespace and key that belongs to the resource. */
  metafield?: Maybe<Metafield>;
  /** The product type specified by the merchant. */
  productType?: Maybe<Scalars['String']>;
  /** The localized title of the product in the customer’s locale. */
  title: Scalars['String'];
  /** The name of the product's vendor. */
  vendor?: Maybe<Scalars['String']>;
};


/** Represents a product. */
export type ProductHasAnyTagArgs = {
  tags?: Array<Scalars['String']>;
};


/** Represents a product. */
export type ProductHasTagsArgs = {
  tags?: Array<Scalars['String']>;
};


/** Represents a product. */
export type ProductInAnyCollectionArgs = {
  ids?: Array<Scalars['ID']>;
};


/** Represents a product. */
export type ProductInCollectionsArgs = {
  ids?: Array<Scalars['ID']>;
};


/** Represents a product. */
export type ProductMetafieldArgs = {
  key: Scalars['String'];
  namespace?: InputMaybe<Scalars['String']>;
};

/** Represents a product variant. */
export type ProductVariant = HasMetafields & {
  __typename?: 'ProductVariant';
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** Returns a metafield by namespace and key that belongs to the resource. */
  metafield?: Maybe<Metafield>;
  /** The product that this variant belongs to. */
  product: Product;
  /** Whether the merchandise requires shipping. */
  requiresShipping: Scalars['Boolean'];
  /** An identifier for the product variant in the shop. Required in order to connect to a fulfillment service. */
  sku?: Maybe<Scalars['String']>;
  /** The localized title of the product variant in the customer’s locale. */
  title?: Maybe<Scalars['String']>;
  /** The weight of the product variant in the unit system specified with `weight_unit`. */
  weight?: Maybe<Scalars['Float']>;
  /** Unit of measurement for weight. */
  weightUnit: WeightUnit;
};


/** Represents a product variant. */
export type ProductVariantMetafieldArgs = {
  key: Scalars['String'];
  namespace?: InputMaybe<Scalars['String']>;
};

/** Represents information about the buyer that is interacting with the cart. */
export type PurchasingCompany = {
  __typename?: 'PurchasingCompany';
  /** The company associated to the order or draft order. */
  company: Company;
  /** The company contact associated to the order or draft order. */
  contact?: Maybe<CompanyContact>;
  /** The company location associated to the order or draft order. */
  location: CompanyLocation;
};

/** Represents how products and variants can be sold and purchased. */
export type SellingPlan = HasMetafields & {
  __typename?: 'SellingPlan';
  /** The description of the selling plan. */
  description?: Maybe<Scalars['String']>;
  /** A globally-unique identifier. */
  id: Scalars['ID'];
  /** Returns a metafield by namespace and key that belongs to the resource. */
  metafield?: Maybe<Metafield>;
  /** The name of the selling plan. For example, '6 weeks of prepaid granola, delivered weekly'. */
  name: Scalars['String'];
  /** Whether purchasing the selling plan will result in multiple deliveries. */
  recurringDeliveries: Scalars['Boolean'];
};


/** Represents how products and variants can be sold and purchased. */
export type SellingPlanMetafieldArgs = {
  key: Scalars['String'];
  namespace?: InputMaybe<Scalars['String']>;
};

/**
 * Represents an association between a variant and a selling plan. Selling plan
 * allocations describe the options offered for each variant, and the price of the
 * variant when purchased with a selling plan.
 */
export type SellingPlanAllocation = {
  __typename?: 'SellingPlanAllocation';
  /**
   * A list of price adjustments, with a maximum of two. When there are two, the
   * first price adjustment goes into effect at the time of purchase, while the
   * second one starts after a certain number of orders. A price adjustment
   * represents how a selling plan affects pricing when a variant is purchased with
   * a selling plan. Prices display in the customer's currency if the shop is
   * configured for it.
   */
  priceAdjustments: Array<SellingPlanAllocationPriceAdjustment>;
  /**
   * A representation of how products and variants can be sold and purchased. For
   * example, an individual selling plan could be '6 weeks of prepaid granola,
   * delivered weekly'.
   */
  sellingPlan: SellingPlan;
};

/** The resulting prices for variants when they're purchased with a specific selling plan. */
export type SellingPlanAllocationPriceAdjustment = {
  __typename?: 'SellingPlanAllocationPriceAdjustment';
  /**
   * The effective price for a single delivery. For example, for a prepaid
   * subscription plan that includes 6 deliveries at the price of $48.00, the per
   * delivery price is $8.00.
   */
  perDeliveryPrice: MoneyV2;
  /**
   * The price of the variant when it's purchased with a selling plan For example,
   * for a prepaid subscription plan that includes 6 deliveries of $10.00 granola,
   * where the customer gets 20% off, the price is 6 x $10.00 x 0.80 = $48.00.
   */
  price: MoneyV2;
};

/** Information about the shop. */
export type Shop = HasMetafields & {
  __typename?: 'Shop';
  /** Information about the current time relative to the shop's timezone setting. */
  localTime: LocalTime;
  /** Returns a metafield by namespace and key that belongs to the resource. */
  metafield?: Maybe<Metafield>;
};


/** Information about the shop. */
export type ShopMetafieldArgs = {
  key: Scalars['String'];
  namespace?: InputMaybe<Scalars['String']>;
};

/** A cart line update operation. Only stores on the Shopify Plus plan can use apps with update operations. */
export type UpdateOperation = {
  /** The ID of the cart line. */
  cartLineId: Scalars['ID'];
  /** The image override for the cart line item. */
  image?: InputMaybe<ImageInput>;
  /** The price adjustment for the cart line item. */
  price?: InputMaybe<UpdateOperationPriceAdjustment>;
  /** The title override for the cart line item. */
  title?: InputMaybe<Scalars['String']>;
};

/** A fixed price per unit adjustment to apply to a cart line. */
export type UpdateOperationFixedPricePerUnitAdjustment = {
  /** The fixed price amount per quantity of the cart line item in presentment currency. */
  amount: Scalars['Decimal'];
};

/** A price adjustment to apply to a cart line item. */
export type UpdateOperationPriceAdjustment = {
  /** The price adjustment per unit to apply to the cart line item. */
  adjustment: UpdateOperationPriceAdjustmentValue;
};

/** A price adjustment to apply to a cart line item. */
export type UpdateOperationPriceAdjustmentValue =
  /** A fixed price per unit adjustment to apply to a cart line. */
  { fixedPricePerUnit: UpdateOperationFixedPricePerUnitAdjustment; };

/** Units of measurement for weight. */
export enum WeightUnit {
  /** Metric system unit of mass. */
  Grams = 'GRAMS',
  /** 1 kilogram equals 1000 grams. */
  Kilograms = 'KILOGRAMS',
  /** Imperial system unit of mass. */
  Ounces = 'OUNCES',
  /** 1 pound equals 16 ounces. */
  Pounds = 'POUNDS'
}

export type RunInputVariables = Exact<{ [key: string]: never; }>;


export type RunInput = { __typename?: 'Input', cart: { __typename?: 'Cart', lines: Array<{ __typename?: 'CartLine', id: string, quantity: number, merchandise: { __typename: 'CustomProduct' } | { __typename: 'ProductVariant', id: string, componentReference?: { __typename?: 'Metafield', value: string } | null, productVariantQuantities?: { __typename?: 'Metafield', value: string } | null } }> } };
