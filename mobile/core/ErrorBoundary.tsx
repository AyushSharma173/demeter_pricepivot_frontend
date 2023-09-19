import React from "react";
import { rw } from "./designHelpers";
import { Platform } from "react-native";

export default class ErrorBoundary extends React.Component <any,any>{
    constructor(props:any) {
      super(props);
      this.state = { error: null, errorInfo: null };
    }
    
    componentDidCatch(error:any, errorInfo:any) {
      // Catch errors in any components below and re-render with error message
     Platform.OS=='web' && this.setState({
        error: error,
        errorInfo: errorInfo
      })
      // You can also log error messages to an error reporting service here
    }
    
    render() {
      if (this.state.errorInfo) {
        // Error path
        return (
          <div style={{paddingLeft:rw(16)}}>
            <h2>:(</h2>
            <h2>Something went wrong. Please try to reload the page</h2>
            
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
            <a href="/portal" >Reload Site</a>
          </div>
        );
      }
      // Normally, just render children
      return this.props.children;
    }  
  }