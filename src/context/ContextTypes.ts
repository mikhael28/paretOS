export interface ContextObjectProps {
  // @TODO: needs to become type ImageUrlBuilder, import sanity types?
  img: any;
  openExternalModal?: Function;
  closeExternalModal?: Function;
  openForEdit?: Function;
  item: any;
  url?: string;
}

export interface LibraryEntry {
  createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  body: any[];
  description: string;
  mainImage: any;
  public: string;
  slug: {
    _type: string;
    current: string;
  };
  title: string;
  type: string;
  summary?: string;
}
