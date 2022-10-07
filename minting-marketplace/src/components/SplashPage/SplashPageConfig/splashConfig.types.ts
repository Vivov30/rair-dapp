import {
  TSplashDataType,
  TSplashPageDataButtonType
} from '../splashPage.types';

export type TSplashPageMainBlock = TStyledSplashMainBlockWrapper & {
  children: React.ReactNode;
};

export interface ISplashPageWrapper {
  splashData?: TSplashDataType;
  loginDone?: boolean;
  connectUserData?: () => Promise<void>;
  setIsSplashPage?: (isSplashPage: boolean) => void;
  children: React.ReactNode;
}

export interface IMainBlockDescription {
  description?: string[] | string | null;
  marginTop: string;
  marginBottom: string;
}

//styled components types
export type TStyledMainBlockTitle = {
  color: string;
  fontSize: string;
  fontWeight: number | string;
  fontFamily: string;
  lineHeight: string;
  margin?: string;
  padding?: string;
  textAlign?: string;
  width?: string;
};

export type TStyledMainBlockDescription = {
  marginTop: string;
  marginBottom: string;
};

export type TStyledMainBlockTextContainer = {
  padding: string;
};

//component's props
export type TMainBlockInfoText = TStyledMainBlockTextContainer & {
  children?: React.ReactNode;
};

export type TMainTitleBlock = TStyledMainBlockTitle & {
  text?: string | string[];
};

export type TStyledHigherWrapperSplashPage = {
  fontFamily: string;
};

export type TDefaultThemeType = {
  colors: {
    mainBlock: string;
  };
  mobile: string;
};

export type TStyledSplashMainBlockWrapper = {
  flexDirection?: TFlexDirection;
  justifyContent?: TJustifyContent;
  alignItems?: TAlignItems;
  widthDiff?: string;
  heightDiff?: string;
  bgColor?: string;
  borderRadius: string;
  paddingLeft?: string;
};

export type TStyledImageBlock = {
  widthDiff: string;
  heightDiff: string;
  imageMargin: string;
};

export type TImageMainBlock = TStyledImageBlock & {
  image?: string;
};

export type TFlexDirection =
  | 'column'
  | 'column-reverse'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'row'
  | 'row-reverse'
  | 'unset';

export type TJustifyContent =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

export type TAlignItems =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'stretch'
  | 'baseline';

export type TStyledButtonContainerMainBlock = {
  height?: string;
  width?: string;
  margin?: string;
  gap?: string;
  flexDirection: TFlexDirection;
  justifyContent?: TJustifyContent;
};

export type TButtonContainerMainBlock = TStyledButtonContainerMainBlock & {
  children: React.ReactNode;
};

export type TButtonMainBlock = TStyledButtonMainBlock &
  TStyledButtonImage & {
    buttonData: TSplashPageDataButtonType | undefined;
  };

export type TStyledButtonMainBlock = {
  width?: string;
  borderRadius: string;
  margin: string;
  height?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: string;
  lineHeight?: string;
  background?: string;
  color?: string;
  border?: string;
  flexGrow?: number;
};

export type TStyledButtonImage = {
  buttonImageWidth?: string;
  buttonImageHeight?: string;
  buttonImageMarginRight?: string;
};

export type TStyledButtonMainBlockWrapper = {
  flexDirection?: TFlexDirection;
  justifyContent?: TJustifyContent;
  height: string;
};

export type TButtonMainBlockWrapper = TStyledButtonMainBlockWrapper & {
  children: React.ReactNode;
};
