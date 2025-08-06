interface SchemaItem {
  type: string;
  icon: string;
  label: string;
  control: any;
  name: string;
  formItem?: any;
  config: any;
  columns?: any[];
}

export interface SchemaJson {
  title: string;
  children: SchemaItem[];
}
