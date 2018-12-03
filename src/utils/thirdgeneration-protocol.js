//后台默认数据格式
// export function jsonCallback(data) {
//   return { data, errorCode: [], status: 10000000 };
// }

// 三代协议包格式
class TCPpackage {
    constructor(opts = []) {
        const {
            TP_OFFSET_HEAD_FLAG1 = 0, // 包头  请求包55aa, 响应包aa55
            TP_OFFSET_HEAD_FLAG2 = 1,
            TP_OFFSET_ACK = 2, // 请求包写0, 响应包需注意, 非0为失败
            TP_OFFSET_LABELS = 3, // 流水号, 一段时间内连续的包的Labels不能重复，且同一条指令的请求包和响应包的Labels相同
            TP_OFFSET_SRC_ADDR = 4, // 源地址，即发起数据包的的设备
            TP_OFFSET_DES_ADDR = 5, // 目的地址，即数据包要访问的设备
            TP_OFFSET_DEVICE_TYPE = 6, // 要访问的设备类型，具有串口属性的设备（eg：发送卡，电视卡）的Device Type都为0x00
            TP_OFFSET_PORT_ADDR = 7, // 发送卡的网口地址，即要访问的设备连接在发送卡的那个网口下，网口的排序是从0开始依次增加的
            TP_OFFSET_BOARD_ADDR = 8, // 网线上连接的设备地址，不同的设备独立编号。
            TP_OFFSET_CODE = 10, // 指令类型，0x00表征读命令，0x01表征写命令
            TP_OFFSET_PACKAGE_TYPE = 11, // 数据包的来源类型
            TP_OFFSET_REG_ADDR = 12, // 设备的寄存器地址（32位的寄存器地址，低字节在前，高字节在后）
            TP_OFFSET_DATA_LEN = 16, // 数据包所带的有效数据的长度。其中，写请求包的该字段表示要写入的数据长度；写响应包的该字段数据长度为0；读请求包数的该字段表示要读取的数据长度；读响应包的该字段根据读请求包返回相同的数据长度与数据。
            TP_OFFSET_DATA = 18, // 负载数据，如果是读请求包或者写响应包，没有这一项。即读操作的请求包不带数据，响应包带数据；写操作的请求包带数据，响应包不带数据。
            TP_HEAD_LEN = 18 // 和校验
        } = opts;

        this.TP_OFFSET_HEAD_FLAG1 = TP_OFFSET_HEAD_FLAG1;
        this.TP_OFFSET_HEAD_FLAG2 = TP_OFFSET_HEAD_FLAG2;
        this.TP_OFFSET_ACK = TP_OFFSET_ACK;
        this.TP_OFFSET_LABELS = TP_OFFSET_LABELS;
        this.TP_OFFSET_SRC_ADDR = TP_OFFSET_SRC_ADDR;
        this.TP_OFFSET_DES_ADDR = TP_OFFSET_DES_ADDR;
        this.TP_OFFSET_DEVICE_TYPE = TP_OFFSET_DEVICE_TYPE;
        this.TP_OFFSET_PORT_ADDR = TP_OFFSET_PORT_ADDR;
        this.TP_OFFSET_BOARD_ADDR = TP_OFFSET_BOARD_ADDR;
        this.TP_OFFSET_CODE = TP_OFFSET_CODE;
        this.TP_OFFSET_PACKAGE_TYPE = TP_OFFSET_PACKAGE_TYPE;
        this.TP_OFFSET_REG_ADDR = TP_OFFSET_REG_ADDR;
        this.TP_OFFSET_DATA_LEN = TP_OFFSET_DATA_LEN;
        this.TP_OFFSET_DATA = TP_OFFSET_DATA;
        this.TP_HEAD_LEN = TP_HEAD_LEN;

        const {
            READ = 0x00, // 读
            WRITE = 0x01 // 写
        } = CODE;

        const {
            OK = 0x00, // 成功返回
            TIME_OUT = 0x01, // 失败, 超时 (主要指访问发送卡的后级设备，如接收卡、多功能卡)
            CHECK_ERR_REQUEST = 0x02, // 失败, 请求包校验错误
            CHECK_ERR_REPLY = 0x03, // 失败, 响应包校验错误，主要指访问发送卡的后级设备
            INVALID_CMD = 0x04 // 失败, 无效命令
            // ...
        } = ACK;

        const {
            SENDER_CARD = 0x00, //发送卡
            RECEIVER_CARD = 0x01, //接收卡
            FUNCTION_CARD = 0x02 //多功能卡
        } = DeviceType;
    }
}

export const http = new Http();

export default Http;

// -----------------------------------------------------------------------------------------------------
// 构建三代包
export function makePackage() {
    let srcData;

    //总长度 = 包头长度 + 数据长度 +2个字节和校验
    if (code == CODE.READ) {
        srcData = new ArrayBuffer(TP_HEAD_LEN + 2); // 读包没有数据位  TP_HEAD_LEN+2  一共长度为20
    } else {
        srcData = new ArrayBuffer(TP_HEAD_LEN + dataLen + 2);
    }

    srcData[TP_OFFSET_HEAD_FLAG1] = 0x55; // 请求包55AA     ？？？？方括号中的所有键都将转换为字符串类型，因为JavaScript中的对象只能使用String类型作为键类型。
    srcData[TP_OFFSET_HEAD_FLAG2] = 0xaa;
    srcData[TP_OFFSET_ACK] = 0x00;
    labels = LABELS++;
    srcData[TP_OFFSET_LABELS] = labels;
    srcData[TP_OFFSET_SRC_ADDR] = 0xfe;
    srcData[TP_OFFSET_DES_ADDR] = 0x00;
    srcData[TP_OFFSET_DEVICE_TYPE] = 0x00;
    srcData[TP_OFFSET_PORT_ADDR] = 0x00;
    srcData[TP_OFFSET_BOARD_ADDR] = 0x00;
    srcData[TP_OFFSET_CODE] = code;
    srcData[TP_OFFSET_PACKAGE_TYPE] = 0x00;
    srcData[TP_OFFSET_REG_ADDR] = regAddress;
    srcData[TP_OFFSET_REG_ADDR + 1] = regAddress >> 8;
    srcData[TP_OFFSET_REG_ADDR + 2] = regAddress >> 16;
    srcData[TP_OFFSET_REG_ADDR + 3] = regAddress >> 24;
    srcData[TP_OFFSET_DATA_LEN] = dataLen;
    srcData[TP_OFFSET_DATA_LEN + 1] = dataLen >> 8;

    //读请求包：dataLen!=0,data=null, 写请求包：dataLen!=0, data!=null
    if (data != null && data.length != 0) {
        // 有数据 System.arraycopy(data, 0, srcData, TP_OFFSET_DATA, dataLen); // 把数据放到某位里
        srcData.splice(TP_OFFSET_DATA, 0, ...data);
        checkSum = checkSum(srcData, TP_OFFSET_ACK, TP_HEAD_LEN - 2 + dataLen); // 和校验 校验包是否完整
    } else {
        checkSum = checkSum(srcData, TP_OFFSET_ACK, TP_HEAD_LEN - 2); // 数据  读 无数据
    }

    srcData[srcData.length - 2] = checkSum; // 求和放进去
    srcData[srcData.length - 1] = checkSum >> 8;
}

// 内部工具
function isRequest() {
    if (srcData[0] == 0x55 && srcData[1] == 0xaa) {
        return true;
    }
    return false;
}
function checkSum(arry, index, dataLen) {
    let revise = 0x5555;

    for (let i = index; i < dataLen + index; i++) {
        revise += arry[i] & 0xff;
    }

    return revise & 0xffff;
}

// 可能需要的工具
// 1. 低位在前，高位在后，小端？
// 2. 有的占两位，有的占一位，要相互转换
//

// parseInt('0x55', 16);  85
