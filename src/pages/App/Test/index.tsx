import React, {useState, useEffect} from 'react';
import {Card, Button, Form, message, Modal, Radio} from 'antd';
import {useParams} from "react-router";
import {listQuestionVoByPageUsingPost} from "@/services/backend/questionController";
import {addUserAnswerUsingPost} from "@/services/backend/userAnswerController";
import {history} from "@umijs/max";
import QuestionContentDTO = API.QuestionContentDTO;


// 答题页面组件
const TestPage: React.FC<{ appId: string }> = ({appId}) => {
  const {id} = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questionContentList, setQuestionContentList] = useState<QuestionContentDTO[]>([]);
  const isCurrentQuestionAnswered = answers[currentQuestion] !== undefined;
  const [currentAnswer, setCurrentAnswer] = useState<string | undefined>(undefined);

  // 使用useRequest来处理数据请求
  const loadData = async () => {
    const res = await listQuestionVoByPageUsingPost({
      appId: Number(id)
    })
    const questionData = res?.data?.records?.at(0)?.questionContent;
    if (Number(questionData?.length) > 0) {
      setQuestionContentList(questionData as QuestionContentDTO[])
    }
  }
  useEffect(() => {
    loadData();
  }, []);


  const handleSubmit = async () => {
    console.log(answers)
    try {
      const response = await addUserAnswerUsingPost({
        appId: Number(id),
        choices: answers
      })

      if (response.data) {
        console.log(response.data)
        // 处理结果，显示成绩页面
        message.success('测试提交成功！');
        // 这里可以进一步处理result，例如显示分数
        // 跳转到结果页面
        history.push(`/app/answer/result/${response.data}`)
      } else {
        message.error('提交失败，请重试。');
      }
    } catch (error) {
      message.error('网络错误或服务器无响应。');
    }
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
      <Card
        title={
          <>
            <h2>应用名称</h2>
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
