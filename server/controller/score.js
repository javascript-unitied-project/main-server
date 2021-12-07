const Rank = require("../models/Rank");

const scoreService = require("../service/score");
const logger = require('../log');

// +++ aggregate
const getRankBySubject = async (req, res) => {
  const getTop3 = (allRank) => allRank.map(rank => rank.ranks);

  try {
    const { subjectId } = req.params;

    const allRank = await scoreService.getRankBySubject(subjectId);
    res.json({
      data: getTop3(allRank)
    });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
}

const getMyQuizScoreDetail = async (req, res) => {
  try {
    const { name, quizRecord } = req.session.user;

    res.json({
      data: scoreService.getScore(quizRecord),
      name
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

// +++ raw
const patchMyQuizScoreWithRank = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { sheet } = req.body;
    const { name, username } = req.session.user;

    if (!sheet[chapterId] || !sheet[chapterId].length)
      throw new Error("invalid data");

    const [, user] = await scoreService.patchQuizRecord(
      username,
      chapterId,
      sheet[chapterId]
    );
    const totalPercentage = scoreService.getScorePercentage(user.dataValues);
    const ranks = await scoreService.patchSubjectRank(
      name,
      chapterId.substring(0, 2),
      totalPercentage
    );
    const result = ranks.filter(each => each instanceof Rank)[0] || ranks;

    req.session.user.quizRecord = user.dataValues.quizRecord;
    res.json({
      message: `${result.dataValues.subjectId} / ${chapterId} is updated`,
      data: result.dataValues
    });
  } catch (err) {
    logger.error(err.message);
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const getQuizScoreByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const records = await scoreService.getQuizRecordByChapter(chapterId);
    const data = records.some(each => !each.quizRecord[`${chapterId}`])
      ? undefined
      : records.map((each) => each.quizRecord[`${chapterId}`]);

    res.json({ data });
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

const getMyQuizScore = (req, res) => {
  try {
    const { name, quizRecord } = req.session.user;

    res.json({
      message: 'keep logined',
      name,
      quizRecord
    });
  } catch (err) {
    logger.error(err);
    res.status(401).json({ message: err.message });
  }
};

module.exports = {
  getRankBySubject,
  getMyQuizScoreDetail,
  patchMyQuizScoreWithRank,
  getQuizScoreByChapter,
  getMyQuizScore
};