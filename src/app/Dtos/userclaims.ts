import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
// ...autres imports...
export interface UserClaims {
  sub: string;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    'my-webapp-client': {
      roles: string[];
    };
    account: {
      roles: string[];
    };
  };
}