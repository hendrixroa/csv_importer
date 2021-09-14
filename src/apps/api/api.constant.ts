export const swaggerDescription = `### Authentication

### Success responses
HTTP status = 2xx

\`\`\`
{
  data: { ... }
}
\`\`\`

by convention for paginated endpoint:

\`\`\`
{
  data: { items: [], meta: { count, limit, page, pages, headers } }
}
\`\`\`

### Error responses

HTTP status = 4xx/5xx

\`\`\`
  {
    message: 'Error message' | ['Error message 1', 'Error message 2', ...],
    errorType: 'authentication' | 'validation' | 'internal' | 'not_found'
  } 
\`\`\`

* status 401 - type = 'authentication'
* status 400 - type = 'validation'
* status 5xx - type = 'internal'`;
