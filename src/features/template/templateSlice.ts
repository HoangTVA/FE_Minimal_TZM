import { AttrProps } from './../../models/dto/attrProps';
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { TemplateProps } from "models";
import { Store } from "models/dto/store";

export interface TemplateState {
    loading: boolean;
    stores: Store[];
    attrs: TemplateProps;
}
export interface FetchAttrs {
    storeId: number;
    typeId: number;
}
const templateProp: TemplateProps = {
    address: "long hồ vĩnh long",
    backgroundImage: "https://static.wixstatic.com/media/5b44bf_317f722d308c4426a6ba01e3c61bf072~mv2_d_4206_2366_s_2.jpg/v1/fill/w_1000,h_563,al_c,q_90,usm_0.66_1.00_0.01/5b44bf_317f722d308c4426a6ba01e3c61bf072~mv2_d_4206_2366_s_2.jpg",
    logoImage: "https://material-tailwind.com/_next/static/images/team-2-800x800-3e08ef145920c93bbe320add0d2ef58d.jpg",
    facebook: "https://www.facebook.com/profile.php?id=100007220732995",
    gmail: "sample9@gmail.com",
    instagram: "https://www.facebook.com/profile.php?id=100007220732995",
    phone: "0939761499",
    slogan: "slogan",
    title: "Your title",
    website: "website.com",
    youtube: "https://www.facebook.com/profile.php?id=100007220732995",
    zalo: ""
}
const initialState: TemplateState = {
    loading: false,
    attrs: templateProp,
    stores: []
}
const templateSlice = createSlice({
    name: 'template',
    initialState,
    reducers: {
        fetchStores(state) {
            state.loading = true;
        },
        fetchDataSuccess(state) {
            state.loading = false;
        },
        fetchDataFailed(state) {
            state.loading = false;
        },
        fetchAttrs(state, action: PayloadAction<FetchAttrs>) {
            state.loading = true;
        },
        setStores(state, action: PayloadAction<Store[]>) {
            state.stores = action.payload;
        },
        setAttrs(state, action: PayloadAction<TemplateProps>) {
            state.attrs = action.payload;
        }
    }
});
//action
export const templateActions = templateSlice.actions;
//selectors
export const selectAttrs = (state: RootState) => state.template.attrs;
export const selectLoading = (state: RootState) => state.template.loading;
export const selectStore = (state: RootState) => state.template.stores;
export const selectStoreOptions = createSelector(selectStore, (stores) => stores.map((store) => ({
    id: store.id,
    name: store.name
})));
export const selectAttrProps = createSelector(selectAttrs, (attr) => {
    const rs = {
        address: attr.address,
        backgroundImage: attr.backgroundImage,
        logoImage: attr.logoImage,
        facebook: attr.facebook,
        gmail: attr.gmail,
        instagram: attr.instagram,
        phone: attr.phone,
        slogan: attr.slogan,
        title: attr.title,
        website: attr.website,
        youtube: attr.youtube,
        zalo: attr.zalo,

    } as AttrProps
    return rs;
});
//reducer
const templateReducer = templateSlice.reducer;
export default templateReducer;