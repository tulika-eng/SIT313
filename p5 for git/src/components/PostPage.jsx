import { useState } from 'react'

function PostPage() {
  const [postType, setPostType] = useState('question')
  const [questionData, setQuestionData] = useState({ title: '', description: '', tags: '' })
  const [articleData, setArticleData] = useState({ title: '', abstract: '', articleText: '', tags: '' })
  const [errors, setErrors] = useState({})
  const [popup, setPopup] = useState({ show: false, type: '', title: '', message: '' })

  // Update question fields
  const handleQuestionChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value })
  }

  // Update article fields
  const handleArticleChange = (e) => {
    setArticleData({ ...articleData, [e.target.name]: e.target.value })
  }

  // Count the tags
  const countTags = (tags) => {
    return tags.split(',').filter((tag) => tag.trim() !== '').length
  }

  // Close the popup
  const closePopup = () => {
    setPopup({ ...popup, show: false })
  }


  // Check the form before posting
  const handleSubmit = (e) => {
    e.preventDefault()
    let newErrors = {}

    if (postType === 'question') {
      if (questionData.title.trim() === '') {
        newErrors.title = 'Title is required for your question.'
      }
      if (questionData.description.trim() === '') {
        newErrors.description = 'Please describe your problem.'
      }
      if (questionData.tags.trim() === '') {
        newErrors.tags = 'At least 1 tag is required.'
      } else if (countTags(questionData.tags) > 3) {
        newErrors.tags = 'Please enter no more than 3 tags.'
      }
    } else {
      if (articleData.title.trim() === '') {
        newErrors.title = 'Title is required for your article.'
      }
      if (articleData.abstract.trim() === '') {
        newErrors.abstract = 'Please provide a 1-paragraph abstract.'
      }
      if (articleData.articleText.trim() === '') {
        newErrors.articleText = 'Article text cannot be empty.'
      }
      if (articleData.tags.trim() === '') {
        newErrors.tags = 'At least 1 tag is required.'
      } else if (countTags(articleData.tags) > 3) {
        newErrors.tags = 'Please enter no more than 3 tags.'
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setPopup({
        show: true,
        type: 'error',
        title: 'Validation Error',
        message: Object.values(newErrors).join('\n')
      })
      return
    }

    setPopup({
      show: true,
      type: 'success',
      title: 'Post Sent Successfully!',
      message: postType === 'question'
        ? 'Your question has been posted successfully. (Feature simulation)'
        : 'Your article has been posted successfully. (Feature simulation)'
    })

    if (postType === 'question') {
      setQuestionData({ title: '', description: '', tags: '' })
    } else {
      setArticleData({ title: '', abstract: '', articleText: '', tags: '' })
    }
    setErrors({})
  }

  return (
    <main>
      <div>
        <form onSubmit={handleSubmit} noValidate>

          <div style={{ fontSize: '70px', fontWeight: 'bold' }}>
            New Post
          </div>

          <div>
            <span>Select Post Type:</span>

            <label>
              <input
                type="radio"
                name="postType"
                value="general"
                checked={postType === 'general'}
                onChange={() => {
                  setPostType('general')
                  setErrors({})
                }}
              />
              General
            </label>
            <label>
              <input
                type="radio"
                name="postType"
                value="question"
                checked={postType === 'question'}
                onChange={() => {
                  setPostType('question')
                  setErrors({})
                }}
              />
              Question
            </label>

            <label>
              <input
                type="radio"
                name="postType"
                value="article"
                checked={postType === 'article'}
                onChange={() => {
                  setPostType('article')
                  setErrors({})
                }}
              />
              Article
            </label>
          </div>

          <div>
            What do you want to ask or share
          </div>

          <p>
            This section changes depending on the type of post.
            <span>
              {postType === 'question'
                ? ' For a question, fill in the details below.'
                : ' For an article, fill in the details below.'}
            </span>
          </p>

          {postType === 'question' ? (
            <div>
              <div>
                <div>
                  <label htmlFor="q-title">
                    Title
                  </label>
                  <input
                    id="q-title"
                    name="title"
                    value={questionData.title}
                    onChange={handleQuestionChange}
                    placeholder="Start your question with how, what, why, etc."

                  />
                </div>
                {errors.title && <p>{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="q-desc">
                  Describe your problem
                </label>
                <textarea
                  id="q-desc"
                  name="description"
                  rows={10}
                  value={questionData.description}
                  onChange={handleQuestionChange}

                />
                {errors.description && <p>{errors.description}</p>}
              </div>

              <div>
                <div>
                  <label htmlFor="q-tags">
                    Tags
                  </label>
                  <input
                    id="q-tags"
                    name="tags"
                    value={questionData.tags}
                    onChange={handleQuestionChange}
                    placeholder="Add up to 3 tags, separated by commas"

                  />
                </div>
                {errors.tags && <p>{errors.tags}</p>}
              </div>
            </div>
          ) : (
            <div>
              <div>
                <div>
                  <label htmlFor="a-title">
                    Title
                  </label>
                  <input
                    id="a-title"
                    name="title"
                    value={articleData.title}
                    onChange={handleArticleChange}
                    placeholder="Enter a title"

                  />
                </div>
                {errors.title && <p>{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="a-abstract">
                  Abstract
                </label>
                <textarea
                  id="a-abstract"
                  name="abstract"
                  rows={3}
                  value={articleData.abstract}
                  onChange={handleArticleChange}
                  placeholder="Enter a short abstract"

                />
                {errors.abstract && <p>{errors.abstract}</p>}
              </div>

              <div>
                <label htmlFor="a-text">
                  Article Text
                </label>
                <textarea
                  id="a-text"
                  name="articleText"
                  rows={8}
                  value={articleData.articleText}
                  onChange={handleArticleChange}
                  placeholder="Write your article here"

                />
                {errors.articleText && <p>{errors.articleText}</p>}
              </div>

              <div>
                <label htmlFor="a-tags">
                  Tags
                </label>
                <input
                  id="a-tags"
                  name="tags"
                  value={articleData.tags}
                  onChange={handleArticleChange}
                  placeholder="Add up to 3 tags, separated by commas"

                />
                {errors.tags && <p>{errors.tags}</p>}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"

            >
              Post
            </button>
          </div>
        </form>
      </div>

      {popup.show && (
        <div role="dialog" aria-modal="true" onClick={closePopup}>
          <div onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={closePopup}>
              X
            </button>

            <h3>{popup.title}</h3>
            <p>{popup.message}</p>

            <button type="button" onClick={closePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default PostPage
