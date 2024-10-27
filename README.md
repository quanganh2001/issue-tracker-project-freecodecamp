**My solution:**

# Functional Tests
```js
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // Create an issue with every field: POST request to /api/issues/{project}
  test("Create an issue with every field", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
        issue_text: "Text",
        created_by: "Function Test - Every Field",
        assigned_to: "Chai",
        status_text: "In QA",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "Text");
        assert.equal(res.body.created_by, "Function Test - Every Field");
        assert.equal(res.body.assigned_to, "Chai");
        assert.equal(res.body.status_text, "In QA");
        done();
      })
  });

  // Create an issue with only required fields: POST request to /api/issues/{project}
  test("Create an issue with only required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
        issue_text: "Text",
        created_by: "Function Test - Only Required Fields",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "Text");
        assert.equal(
          res.body.created_by,
          "Function Test - Only Required Fields"
        );
        done();
      })
  });

  // Create an issue with missing required fields: POST request to /api/issues/{project}
  test("Create an issue with missing required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      })
  });

  // View issues on a project: GET request to /api/issues/{project}
  test("View issues on a project", function (done) {
    chai
      .request(server)
      .get("/api/issues/test")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      })
  });

  // View issues on a project with one filter: GET request to /api/issues/{project}
  test("View issues on a project with one filter", function (done) {
    chai
      .request(server)
      .get("/api/issues/test?issue_title=Title")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      })
  });

  // View issues on a project with multiple filters: GET request to /api/issues/{project}
  test("View issues on a project with multiple filters", function (done) {
    chai
      .request(server)
      .get("/api/issues/test?issue_title=Title&issue_text=Text")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      })
  });

  // Update one field on an issue: PUT request to /api/issues/{project}
  test("Update one field on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: "1",
        issue_title: "Updated Title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "1");
        done();
      })
  });

  // Update multiple fields on an issue: PUT request to /api/issues/{project}
  test("Update multiple fields on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: "1",
        issue_title: "Updated Title",
        issue_text: "Updated Text",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "1");
        done();
      })
  });

  // Update an issue with missing _id: PUT request to /api/issues/{project}
  test("Update an issue with missing _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        issue_title: "Updated Title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      })
  });

  // Update an issue with no fields to update: PUT request to /api/issues/{project}
  test("Update an issue with no fields to update", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: "1",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "no update field(s) sent");
        assert.equal(res.body._id, "1");
        done();
      })
  });

  // Update an issue with an invalid _id: PUT request to /api/issues/{project}
  test("Update an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: "invalid_id",
        issue_title: "Updated Title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update");
        assert.equal(res.body._id, "invalid_id");
        done();
      })
  });

  // Delete an issue: DELETE request to /api/issues/{project}
  test("Delete an issue", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({
        _id: "1",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, "1");
        done();
      })
  });

  // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
  test("Delete an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({
        _id: "invalid_id",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, "invalid_id");
        done();
      })
  });

  // Delete an issue with missing _id: DELETE request to /api/issues/{project}
  test("Delete an issue with missing _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      })
  });
});

```
# Server
```js
const issues = {
  test: [
    {
      _id: "1",
      issue_title: "Title",
      issue_text: "Text",
      created_by: "Functional Test - Every Field",
      assigned_to: "Chai",
      status_text: "In QA",
      created_on: new Date(),
      updated_on: new Date(),
      open: true,
    },
  ],
};

//Routing for API 
apiRoutes(app, issues);  
```
# API
```js
'use strict';

module.exports = function (app, issues) {
  app
    .route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      const filters = req.query;
      const projectIssues = issues[project]
      if (projectIssues && Object.keys(filters).length > 0) {
        const filteredIssues = projectIssues.filter((issue) => {
          for (let key in filters) {
            if (issue[key] !== filters[key]) {
              return false;
            }
          }
          return true;
        });
        res.json(filteredIssues);
      } else {
        res.json(projectIssues || []);
      }
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const projectIssues = issues[project] || [];
      const requiredFields = ["issue_title", "issue_text", "created_by"];
      let missingField = false;
      for (let field of requiredFields) {
        if (req.body[field] === undefined || req.body[field] === "") {
          missingField = true;
          break;
        }
      }
      if (missingField) {
        res.json({ error: "required field(s) missing" });
      } else {
        const newIssue = {
          _id: (projectIssues.length + 1).toString(),
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "",
          status_text: req.body.status_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true,
        };
        projectIssues.push(newIssue);
        issues[project] = projectIssues;
        res.json(newIssue);
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      const projectIssues = issues[project];
      const issueId = req.body._id;
      if (!issueId) {
        return res.json({ error: "missing _id" });
      }
      const fieldsToUpdate = Object.keys(req.body).filter(
        (key) => key !== "_id"
      );
      if (fieldsToUpdate.length === 0) {
        return res.json({ error: 'no update field(s) sent', _id: issueId })
      }
      const issue = projectIssues.find((issue) => issue._id === issueId);
      if (!issue) {
        res.json({ error: "could not update", _id: issueId });
      } else {
        for (let key in req.body) {
          if (key !== "_id" && req.body[key] !== "") {
            issue[key] = req.body[key];
          }
        }
        issue.updated_on = new Date();
        res.json({ result: "successfully updated", _id: issueId });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      const projectIssues = issues[project];
      const issueId = req.body._id;
      if (!issueId) {
        return res.json({ error: "missing _id" });
      }
      const issueIndex = projectIssues.findIndex(
        (issue) => issue._id === issueId
      );
      if (issueIndex === -1) {
        return res.json({ error: "could not delete", _id: issueId });
      }
      projectIssues.splice(issueIndex, 1);
      res.json({ result: "successfully deleted", _id: issueId });
    });
};

```