const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

exports.generateToken = (req, res) => {
  try {
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    const { channelName, uid } = req.body;

    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpireTime,
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
