export interface IAuth {
    assigned_roles: string[];
    avatar_url: string;
    displayname: string;
    id: number;
    samaccountname: string;
}


export interface IAlias {
    items: AliasItemType[];
}

export type AliasItemType = {
    alias: string;
    origins: string[];
}


