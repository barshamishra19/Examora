'use client';

import React, { useState } from 'react';
import { ChevronDown, BookOpen, Clock, Target, FileText, TrendingUp } from 'lucide-react';
import { getExamDetailedInfo, getExamSyllabus, getExamPaperStructure, getExamFeatures, getExamResources, getExamCutoffs } from '@/data/examDetails';
import { cn } from '@/lib/utils';

interface ExamDetailsViewProps {
  examId: string | number;
  examName: string;
}

export default function ExamDetailsView({ examId, examName }: ExamDetailsViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const normalizedExamId = String(examId);
  
  const examInfo = getExamDetailedInfo(normalizedExamId);
  const syllabus = getExamSyllabus(normalizedExamId);
  const paperStructure = getExamPaperStructure(normalizedExamId);
  const features = getExamFeatures(normalizedExamId);
  const resources = getExamResources(normalizedExamId);
  const cutoffs = getExamCutoffs(normalizedExamId);

  if (!examInfo) {
    return <div className="p-6 text-center text-foreground-muted">Exam details not available</div>;
  }

  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections);
    if (newSections.has(section)) {
      newSections.delete(section);
    } else {
      newSections.add(section);
    }
    setExpandedSections(newSections);
  };

  return (
    <div className="space-y-4 p-6">
      {/* Overview Section */}
      <div className="card-premium">
        <button
          onClick={() => toggleSection('overview')}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-accent" />
            <h3 className="font-heading font-bold text-lg">Exam Overview</h3>
          </div>
          <ChevronDown className={cn('w-5 h-5 transition-transform', expandedSections.has('overview') && 'rotate-180')} />
        </button>
        
        {expandedSections.has('overview') && (
          <div className="p-4 border-t border-border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examInfo.fullName && (
                <div>
                  <p className="text-sm text-foreground-muted font-medium">Full Name</p>
                  <p className="text-foreground font-semibold">{examInfo.fullName}</p>
                </div>
              )}
              {examInfo.conductingBody && (
                <div>
                  <p className="text-sm text-foreground-muted font-medium">Conducting Body</p>
                  <p className="text-foreground font-semibold">{examInfo.conductingBody}</p>
                </div>
              )}
              {examInfo.examFormat && (
                <div>
                  <p className="text-sm text-foreground-muted font-medium">Exam Format</p>
                  <p className="text-foreground font-semibold">{examInfo.examFormat}</p>
                </div>
              )}
              {examInfo.duration && (
                <div>
                  <p className="text-sm text-foreground-muted font-medium">Duration</p>
                  <p className="text-foreground font-semibold">{examInfo.duration}</p>
                </div>
              )}
              {examInfo.totalQuestions && (
                <div>
                  <p className="text-sm text-foreground-muted font-medium">Total Questions</p>
                  <p className="text-foreground font-semibold">{examInfo.totalQuestions}</p>
                </div>
              )}
              {examInfo.totalMarks && (
                <div>
                  <p className="text-sm text-foreground-muted font-medium">Total Marks</p>
                  <p className="text-foreground font-semibold">{examInfo.totalMarks}</p>
                </div>
              )}
              {examInfo.negativeMarking && (
                <div className="md:col-span-2">
                  <p className="text-sm text-foreground-muted font-medium">Negative Marking</p>
                  <p className="text-foreground font-semibold">{examInfo.negativeMarking}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Paper Structure */}
      {paperStructure.length > 0 && (
        <div className="card-premium">
          <button
            onClick={() => toggleSection('structure')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-accent" />
              <h3 className="font-heading font-bold text-lg">Paper Structure</h3>
            </div>
            <ChevronDown className={cn('w-5 h-5 transition-transform', expandedSections.has('structure') && 'rotate-180')} />
          </button>
          
          {expandedSections.has('structure') && (
            <div className="p-4 border-t border-border space-y-3">
              {paperStructure.map((section, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{section.name}</h4>
                    <span className="text-xs font-medium text-accent">{section.questions}Q × {section.marks}M</span>
                  </div>
                  {section.duration && (
                    <p className="text-sm text-foreground-muted flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {section.duration}
                    </p>
                  )}
                  {section.negativeMarking && (
                    <p className="text-sm text-foreground-muted mt-1">{section.negativeMarking}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Syllabus Breakdown */}
      {syllabus.length > 0 && (
        <div className="card-premium">
          <button
            onClick={() => toggleSection('syllabus')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-accent" />
              <h3 className="font-heading font-bold text-lg">Syllabus Breakdown</h3>
            </div>
            <ChevronDown className={cn('w-5 h-5 transition-transform', expandedSections.has('syllabus') && 'rotate-180')} />
          </button>
          
          {expandedSections.has('syllabus') && (
            <div className="p-4 border-t border-border space-y-4">
              {syllabus.map((subject, idx) => (
                <div key={idx} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{subject.subject}</h4>
                    {subject.weightage && (
                      <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                        {subject.weightage}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {subject.topics.map((topic, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2 text-sm text-foreground-secondary">
                        <span className="text-accent font-bold mt-0.5">•</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Key Features */}
      {features.length > 0 && (
        <div className="card-premium">
          <button
            onClick={() => toggleSection('features')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-accent" />
              <h3 className="font-heading font-bold text-lg">Key Features</h3>
            </div>
            <ChevronDown className={cn('w-5 h-5 transition-transform', expandedSections.has('features') && 'rotate-180')} />
          </button>
          
          {expandedSections.has('features') && (
            <div className="p-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-accent font-bold mt-0.5">✓</span>
                  <span className="text-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommended Resources */}
      {resources.length > 0 && (
        <div className="card-premium">
          <button
            onClick={() => toggleSection('resources')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-accent" />
              <h3 className="font-heading font-bold text-lg">Recommended Resources</h3>
            </div>
            <ChevronDown className={cn('w-5 h-5 transition-transform', expandedSections.has('resources') && 'rotate-180')} />
          </button>
          
          {expandedSections.has('resources') && (
            <div className="p-4 border-t border-border space-y-2">
              {resources.map((resource, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{resource.name}</p>
                    <p className="text-xs text-foreground-muted capitalize">{resource.type}</p>
                  </div>
                  {resource.link && (
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm font-medium">
                      Visit →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cutoff Trends */}
      {cutoffs.length > 0 && (
        <div className="card-premium">
          <button
            onClick={() => toggleSection('cutoffs')}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h3 className="font-heading font-bold text-lg">Cutoff Trends</h3>
            </div>
            <ChevronDown className={cn('w-5 h-5 transition-transform', expandedSections.has('cutoffs') && 'rotate-180')} />
          </button>
          
          {expandedSections.has('cutoffs') && (
            <div className="p-4 border-t border-border space-y-3">
              {cutoffs.map((cutoff, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div>
                    <p className="font-semibold text-foreground">Year {cutoff.year}</p>
                    {cutoff.category && <p className="text-xs text-foreground-muted">{cutoff.category}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent text-lg">{cutoff.score}</p>
                    {cutoff.rank && <p className="text-xs text-foreground-muted">Rank: {cutoff.rank.toLocaleString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
