export interface Link {
  href: string;
}

export interface Links {
  self: Link;
  myCollections: Link;
}

export interface LinksHolder {
  _links: Links;
}
