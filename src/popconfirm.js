import React from 'react';
import ReactDOM from 'react-dom'
import styled, { ThemeProvider } from 'styled-components';
import {
  Window,
  WindowContent,
  WindowHeader,
  Button,
  Toolbar,
} from 'react95';
import original from 'react95/dist/themes/original';

const Wrapper = styled.div`
  padding: 5rem;
  position: absolute;
  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: '';
      position: absolute;
      background: ___CSS_0___;
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .window {
    width: 400px;
    min-height: 200px;
    background: #c6c6c6;
  }
  .window:nth-child(2) {
    margin: 2rem;
  }
  .footer {
    display: block;
    margin: 0.25rem;
    height: 31px;
    line-height: 31px;
    padding-left: 0.25rem;
  }
`;

export const eventBus = {};
export class PopConfirm extends React.Component {
    state= {
        text: '',
        open: false
    };

    componentDidMount() {
        eventBus.onMessage = (text) => {
            this.setState({text, open: true})
            document.querySelector('#popconfirm').setAttribute('style', "width:100%; height: 100%; z-index: 100; position: absolute;")
            setTimeout(() => {
                this.setState({open: false});
                document.querySelector('#popconfirm').setAttribute('style', "width:100%; height: 100%; z-index: 100; position: absolute; display: none;")
            }, 5000);
        }
    }
    render() {
        if (!this.state.open) {
            return null
        }
        return (
            <ThemeProvider theme={original}>
            <Wrapper>
              <Window resizable className='window'>
                <WindowHeader className='window-header'>
                  <span>计算结果</span>
                  <Button>
                    <span className='close-icon' />
                  </Button>
                </WindowHeader>
                <Toolbar>
                  <Button variant='menu' size='sm'>
                    File
                  </Button>
                  <Button variant='menu' size='sm'>
                    Edit
                  </Button>
                  <Button variant='menu' size='sm' disabled>
                    Save
                  </Button>
                </Toolbar>
                <WindowContent>
                  <p>
                    {this.state.text}
                  </p>
                </WindowContent>
                <Button>
                OK
                </Button>
              </Window>
            </Wrapper>
            </ThemeProvider>
          );
    }
}
