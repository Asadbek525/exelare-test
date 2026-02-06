import { xml2js } from 'xml-js';

export class PermissionsHelper {
  static getPermissionObj(permissionsXml: string): unknown {
    if (!permissionsXml) {
      return {};
    }
    try {
      return xml2js(permissionsXml, { compact: true, ignoreComment: true, nativeType: true });
    } catch (error) {
      console.error('Error parsing permissions XML', error);
      return {};
    }
  }
}
