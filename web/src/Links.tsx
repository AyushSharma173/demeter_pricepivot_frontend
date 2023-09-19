// It is web registry
import AppNew from "AppNew";
import ErrorBoundary from "core/ErrorBoundary";
import Layout from "Layout";
import PriceChecker from "PriceChecker";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResetPassword from "ResetPassword";
// import Response from "Response";

import ShoppingList from "ShoppingList";

//require('AppMobile') // initialize the mobile application.





export default function Links(){
  
    return (<BrowserRouter>
    <Routes>
    <Route path='/' element={<Layout/>}>
      <Route index element={<AppNew/>}/>
      <Route path="PriceChecker" element={<ErrorBoundary><PriceChecker/>
      </ErrorBoundary>
      }/>
      <Route path="ShoppingList" element={ <ShoppingList/>}/>
      {/* <Route path="response" element={<Response/>}/> */}
      <Route path="resetPassword" element={<ResetPassword/>}/>
    
    </Route>
    </Routes>
    </BrowserRouter>)
 }