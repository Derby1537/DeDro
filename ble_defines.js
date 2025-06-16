const HW_SERV_UUID =            "00000000000111e19ab40002a5d5c51b"

/*
 * Contains: two temperature values, battery percentage and pressure value
 * size: 12 Bytes
 * Attributes: CHAR_PROP_NOTIFY|CHAR_PROP_READ
*/
const ENVIRONMENTAL_CHAR_UUID = "001d0000000111e1ac360002a5d5c51b";

/*
 * Contains: accelerometer, gyroscope and pressure
 * size: 20 Bytes
 * Attributes: CHAR_PROP_NOTIFY
*/
const ACC_GYRO_MAG_CHAR_UUID =  "00e00000000111e1ac360002a5d5c51b"

/*
 * size: 4 Bytes
 * Attributes: CHAR_PROP_NOTIFY | CHAR_PROP_READ
*/
const ACC_EVENT_CHAR_UUID =     "00000400000111e1ac360002a5d5c51b";

/*
 * Contains arming data
 * size: 3 Bytes
 * Attributes: CHAR_PROP_NOTIFY | CHAR_PROP_READ
*/
const ARMING_CHAR_UUID =        "20000000000111e1ac360002a5d5c51b";

/*
 * Contains commands to send to drone
 * size: 7 Bytes
 * Attributes: CHAR_PROP_WRITE_WITHOUT_RESP | CHAR_PROP_WRITE
*/
const MAX_CHAR_UUID =           "00008000000111e1ac360002a5d5c51b";

const CONSOLE_SERV_UUID =       "00000000000e11e19ab40002a5d5c51b";

/*
 * Contains term_update data
 * size: 20 Bytes
 * Attributes: CHAR_PROP_NOTIFY| CHAR_PROP_WRITE_WITHOUT_RESP | CHAR_PROP_WRITE | CHAR_PROP_READ
*/
const TERM_CHAR_UUID =          "00000001000e11e1ac360002a5d5c51b";

/*
 * Contains stderr_update data
 * size: 20 Bytes
 * Attributes: CHAR_PROP_NOTIFY | CHAR_PROP_READ
*/
const STDERR_CHAR_UUID =        "00000002000e11e1ac360002a5d5c51b";

const CONFIG_SERV_UUID =        "00000000000f11e19ab40002a5d5c51b";

/*
 * Contains data to be configured
 * size: 20 Bytes
 * Attributes: CHAR_PROP_NOTIFY| CHAR_PROP_WRITE_WITHOUT_RESP
*/
const CONFIG_CHAR_UUID =        "00000002000f11e1ac360002a5d5c51b";

module.exports = {
    HW_SERV_UUID,
    ENVIRONMENTAL_CHAR_UUID,
    ACC_GYRO_MAG_CHAR_UUID,
    ACC_EVENT_CHAR_UUID,
    ARMING_CHAR_UUID,
    MAX_CHAR_UUID,
    CONSOLE_SERV_UUID,
    TERM_CHAR_UUID,
    STDERR_CHAR_UUID,
    CONFIG_SERV_UUID,
    CONFIG_CHAR_UUID
}
