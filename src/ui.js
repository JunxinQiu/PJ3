import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { styleReset, List, ListItem, Divider } from 'react95';
import original from "react95/dist/themes/original";
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
  
`;

export class ControlPanel extends React.Component {
    render() {
        return (
            <div style={{width:"100%", height: '100%', justifyContent:'center', alignItems: 'center', display: 'flex', margin: 'auto', background: 'teal', zIndex: 101}}>
              <GlobalStyles />
              <ThemeProvider theme={original}>
                    <List>
                    <ListItem onClick={this.props.start}>🎤 选择地点</ListItem>
                    <Divider />
                    <ListItem >💃🏻 开始导航</ListItem>
                    <Divider />
                    <ListItem onClick={this.props.halt}>😴 重设</ListItem>
                    {/* <Divider />
                    <ListItem onClick={this.props.measure}>😴 测量</ListItem> */}
                    </List>
              </ThemeProvider>
            </div>
          );
    }
} 

