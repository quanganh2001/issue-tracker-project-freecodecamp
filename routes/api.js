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
