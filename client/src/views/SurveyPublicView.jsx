import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosClient from '../axios'
import SurveyPublicQuestionView from '../components/SurveyPublicQuestionView'

export default function SurveyPublicView() {
  const answers = {}
  const [surveyFinished, setSurveyFinished] = useState(false)
  const [survey, setSurvey] = useState({
    questions: []
  })
  const [loading, setLoading] = useState(false)
  const { slug } = useParams()

  useEffect(() => {
    setLoading(true)
    axiosClient
      .get(`/survey/get-by-slug/${slug}`)
      .then(({ data }) => {
        setSurvey(data.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const answerChanged = (question, value) => {
    answers[question.id] = value
    console.log(question, value)
  }

  const onSubmit = (ev) => {
    ev.preventDefault()

    console.log(answers)

    axiosClient.post(`/survey/${survey.id}/answer`, { answers }).then(() => {
      setSurveyFinished(true)
    })
  }

  return (
    <form className="container mx-auto" onSubmit={(ev) => onSubmit(ev)}>
      {loading && <div className="flex justify-center">Loading...</div>}
      {!loading && (
        <>
          <div>
            <div className="grid grid-cols-6">
              <div className="mr-4">
                <img src={survey.image_url} alt={survey.title} />
              </div>
              <div className="col-span-5">
                <h1 className="text-3xl mb-3">{survey.title}</h1>
                <p className="text-gray-500 text-sm mb-3">
                  Expire date: {survey.expire_date}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {survey.description}
                </p>
              </div>
            </div>

            {surveyFinished && (
              <div className="py-8 px-6 bg-emerald-500 text-white w-[600px] mx-auto">
                Thank you for participating in the survey
              </div>
            )}

            {!surveyFinished && (
              <div>
                {survey.questions.map((question, index) => (
                  <SurveyPublicQuestionView
                    key={question.id}
                    question={question}
                    index={index}
                    answerChanged={(val) => answerChanged(question, val)}
                  />
                ))}
              </div>
            )}
          </div>
          {!surveyFinished && (
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          )}
        </>
      )}
    </form>
  )
}
