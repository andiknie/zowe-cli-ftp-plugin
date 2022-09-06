/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import * as iconvLite from 'iconv-lite';

export class EncodingUtils {

    /**
     * Convert encoding of an UTF-8 string or a buffer
     *
     * @param {String|Buffer} str String to be converted
     * @param {String} to Encoding to be converted to
     * @param {String} [from='UTF-8'] Encoding to be converted from
     * @return {Buffer} Encoded string
     */
    public static convert(str: any, to: string, from: string): Buffer {
        from = EncodingUtils.checkEncoding(from || 'UTF-8');
        to = EncodingUtils.checkEncoding(to || 'UTF-8');
        str = str || '';

        let result;

        if (from !== 'UTF-8' && typeof str === 'string') {
            str = Buffer.from(str, 'binary');
        }

        if (from === to) {
            if (typeof str === 'string') {
                result = Buffer.from(str);
            } else {
                result = str;
            }
        } else {
            result = EncodingUtils.convertIconvLite(str, to, from);
        }

        if (typeof result === 'string') {
            result = Buffer.from(result, 'utf-8');
        }
        return result;
    }

    /**
     * Convert encoding of astring with iconv-lite
     *
     * @param {String|Buffer} str String to be converted
     * @param {String} to Encoding to be converted to
     * @param {String} [from='UTF-8'] Encoding to be converted from
     * @return {Buffer} Encoded string
     */
    public static convertIconvLite(str: any, to: string, from: string): Buffer {
        if (to === 'UTF-8') {
            return Buffer.from(iconvLite.decode(str, from));
        } else if (from === 'UTF-8') {
            return iconvLite.encode(str, to);
        } else {
            return iconvLite.encode(iconvLite.decode(str, from), to);
        }
    }

    /**
     * Converts charset name if needed
     *
     * @param {String} name Character set
     * @return {String} Character set name
     */
    public static checkEncoding(name: string): string {
        return (name || '')
            .toString()
            .trim()
            .replace('/^latin[-_]?(d+)$/i', 'ISO-8859-$1')
            .replace('/^win(?:dows)?[-_]?(d+)$/i', 'WINDOWS-$1')
            .replace('/^utf[-_]?(d+)$/i', 'UTF-$1')
            .replace('/^ks_c_5601-1987$/i', 'CP949')
            .replace('/^us[-_]?ascii$/i', 'ASCII')
            .toUpperCase();
    }
}
