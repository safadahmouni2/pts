/**
 * HR-Smart Logging-Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DepartementEnum } from './departementEnum';
import { StatusEnum } from './statusEnum';


export interface SmartObjectDisplayedDataEntry { 
    type?: string;
    points?: number;
    subject?: string;
    departement?: DepartementEnum;
    date?: string;
    hours?: number;
    description?: string;
    status?: StatusEnum;
    name?: string;
    urgency?: string;
    moderator?: string;
    createdAt?: string;
    updatedAt?: string;
}