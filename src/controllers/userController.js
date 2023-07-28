const axios = require('axios');
const path = require('path');
const logger = require('log4js').getLogger(path.parse(__filename).name);
const User = require('../model/User');

const getBalance = async (req, res) => {
  const profile = await User.findOne({ username: req.user }).exec();
  if (!profile) return res.status(401).json({ message: 'User id is incorrect.' });
  const data = {
    balance: profile.balance,
    exposure: profile.exposureLimit,
    redeemBalance: profile.redeemBalance,
  };
  res.json({ data });
};

const generateotp = async (req, res) => {
  const { mobile, ip } = req.body;
  if (!mobile) return res.status(400).json({ message: 'Mobile number is required.' });
  const data = await User.findOne({ mobile }).exec();
  if (!data) return res.status(404).json({ message: 'Mobile number does not exists.' });
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://2factor.in/API/V1/${process.env.SMS_API_KEY}/SMS/${mobile}/AUTOGEN/`,
      headers: {},
      maxRedirects: 0,
    };
    await axios.request(config);
    res.status(200).json({ message: 'OTP generated successfully.' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Error while generating OTP.' });
  }
};

const verifyotp = async (req, res) => {
  const { mobile, ip, otp } = req.body;
  if (!mobile || !otp) return res.status(400).json({ message: 'Mobile number and OTP is required.' });
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://2factor.in/API/V1/${process.env.SMS_API_KEY}/SMS/VERIFY3/${mobile}/${otp}`,
      headers: {},
      maxRedirects: 0,
    };
    const response = await axios.request(config);
    if (response.data.Status === 'Error') {
      res.status(400).json({ message: response.data.Details });
    } else {
      const data = await User.findOne({ mobile }).exec();
      logger.info(data);
      res.status(200).json({ message: data.username });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Error while verifying OTP.' });
  }
};
module.exports = { getBalance, generateotp, verifyotp };
