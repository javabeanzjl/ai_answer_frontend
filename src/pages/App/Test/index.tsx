import React, {useState, useEffect} from 'react';
import {Card, Button, Form, message, Modal, Radio, Progress} from 'antd';
import {useParams} from "react-router";
import {listQuestionVoByPageUsingPost} from "@/services/backend/questionController";
import {addUserAnswerUsingPost} from "@/services/backend/userAnswerController";
import {history} from "@umijs/max";
import {
  getScoringResultVoListByAppIdUsingPost
} from "@/services/backend/scoringResultController";
// @ts-ignore
import {updateAppUsingPost} from "@/services/backend/appController";
import {DotChartOutlined} from "@ant-design/icons";
import {generateSnowFlakeNextIdUsingGet} from "@/services/backend/baseController";


// 答题页面组件
const TestPage: React.FC<{ appId: string }> = ({appId}) => {
  const {id} = useParams();// appId
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questionContentList, setQuestionContentList] = useState<API.QuestionContentDTO[]>([]);
  const isCurrentQuestionAnswered = answers[currentQuestion] !== undefined;
  const [currentAnswer, setCurrentAnswer] = useState<string | undefined>(undefined);
  const [isCustomScore, setIsCustomScore] = useState<boolean>(false);
  const [userAnswerId, setUserAnswerId] = useState<string | undefined>(undefined);
  // 使用useRequest来处理数据请求
  const loadData = async () => {
    // 获取题目数据
    const res = await listQuestionVoByPageUsingPost({
      appId: id as any
    })
    // 获取题目内容
    const questionData = res?.data?.records?.at(0)?.questionContent;
    if (Number(questionData?.length) > 0) {
      setQuestionContentList(questionData as API.QuestionContentDTO[])
    }
    // 获取评分结果
    const result = await getScoringResultVoListByAppIdUsingPost({
      appId: id as any
    })
    if (result.data) {
      if (result.data.length > 0) {
        setIsCustomScore(true);
      }
    }
    // 获取用户答案id
    const userAnswerIdData = await generateSnowFlakeNextIdUsingGet();
    if (userAnswerIdData.data) {
      setUserAnswerId(userAnswerIdData.data as any);
    }
  }
  useEffect(() => {
    loadData();
  }, []);


  const handleSubmit = async () => {
    Modal.confirm({
      title: '请选择评分方式',
      content: (
        <Radio.Group>
          <Radio value="manual">自定义规则评分</Radio>
          <Radio value="ai">AI智能评分</Radio>
        </Radio.Group>
      ),
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        // 获取用户的选择
        const value = (document.querySelector('.ant-radio-group input:checked') as HTMLInputElement).value;
        // 用户选择自定义评分
        let scoringStrategy;
        if (value === 'ai') {
          // 用户选择AI评分，更新app状态
          scoringStrategy = 1;
        } else {
          scoringStrategy = 0;
          // 判断是否有自定义规则
          if (!isCustomScore) {
            message.error('请先设置评分规则或选择Ai评分');
            return;
          }
        }
        try {
          // 用户选择哪种评分，更新app状态
          const res = await updateAppUsingPost({
            id: id as any,
            scoringStrategy: scoringStrategy
          })
          if (res.data) {
            message.success('评分方式选择成功，正在计算评分，请稍等');
          }
          console.log(userAnswerId)
          const response = await addUserAnswerUsingPost({
            id: userAnswerId as any,
            appId: id as any,
            choices: answers
          })

          if (response.data) {
            // 处理结果，显示成绩页面
            message.success('测试提交成功！');
            // 这里可以进一步处理result，例如显示分数
            // 跳转到结果页面
            history.push(`/app/answer/result/${response.data}`)
          } else {
            message.error('提交失败，请检查是否设置评分规则或稍后重试。');
          }
        } catch (error) {
          message.error('网络错误或服务器无响应。');
        }
      },
    });
  };

  const handleNext = () => {
    const nextIndex = currentQuestion + 1;
    const nextAnswer = answers[nextIndex];
    setCurrentAnswer(nextAnswer); // 设置下一题的答案，如果有的话
    setCurrentQuestion((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentQuestion((prev) => {
      const prevIndex = prev - 1;
      setCurrentAnswer(answers[prevIndex] !== undefined ? answers[prevIndex] : undefined);
      return prevIndex;
    });
  };

  const handleOptionChange = (value: string) => {
    console.log("当前选择答案：", value);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    setCurrentAnswer(value);
  };

  const question = questionContentList[currentQuestion];
  if (!question) return null;

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', marginLeft: '3px', marginBottom: 25}}>
        <Button
          type="primary"
          style={{
            backgroundColor: "#333", // 按钮背景色，根据图片调整
            color: "white", // 文字颜色，根据图片调整
            borderColor: "#333", // 边框颜色，根据图片调整
            height: "30px", // 按钮高度，根据图片调整
            lineHeight: "1.5", // 行高，用于垂直居中文本
            padding: "0 15px", // 内边距，根据图片调整
          }}
          onClick={() => {
            history.push(`/app/detail/${id}`);
          }}
        >
          <DotChartOutlined/>返回应用详情页
        </Button></div>
      <Card
        title={
          <>
            {currentQuestion + 1}.{question.title}
          </>
        }
        headStyle={{fontSize: 20}}>
        <Form
          name="question-test-form"
          layout="vertical"
          onFinish={handleNext}
        >
          <Form.Item
            name="answer"
            style={{flexDirection: 'column'}}
          >
            {question.options?.map((option) => (
              <div key={option.key} style={{fontSize: '20px', marginBottom: '16px'}}>
                <Radio
                  value={option.key}
                  style={{fontSize: '18px'}}
                  checked={currentAnswer === option.key}
                  onChange={(e) => handleOptionChange(e.target.value)}
                >
                  {option.value}
                </Radio>
              </div>
            ))}
          </Form.Item>
        </Form>
      </Card>
      <Progress percent={Number(((currentQuestion + 1) / questionContentList.length * 100).toFixed(2))} strokeColor={{
        '0%': '#108ee9',
        '100%': '#87d068',
      }}/>
      <div>
        {currentQuestion > 0 && (
          <Button onClick={handlePrev} style={{marginRight: 8}}>
            上一题
          </Button>
        )}
        {currentQuestion < questionContentList.length - 1 && (
          <Button
            type="primary"
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered}
          >
            下一题
          </Button>
        )}
        {currentQuestion === questionContentList.length - 1 && (
          <Button type="primary" onClick={handleSubmit} disabled={!isCurrentQuestionAnswered}>
            提交
          </Button>
        )}
      </div>
    </div>
  );
};
export default TestPage;
