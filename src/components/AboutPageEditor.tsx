
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus, Trash2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface AboutPageEditorProps {
  content: any;
  onSave: (content: any) => void;
  onCancel: () => void;
}

const AboutPageEditor = ({ content, onSave, onCancel }: AboutPageEditorProps) => {
  const [editingContent, setEditingContent] = useState(content);

  const handleSave = () => {
    onSave(editingContent);
  };

  const renderHeroEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={editingContent.title || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            title: e.target.value
          })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={editingContent.description || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            description: e.target.value
          })}
        />
      </div>
    </div>
  );

  const renderJourneyEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={editingContent.title || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            title: e.target.value
          })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={editingContent.description || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            description: e.target.value
          })}
        />
      </div>
      <ImageUpload
        label="Journey Image"
        value={editingContent.image_url || ''}
        onChange={(url) => setEditingContent({
          ...editingContent,
          image_url: url
        })}
      />
      <div>
        <label className="text-sm font-medium">Story Paragraphs</label>
        {editingContent.content?.paragraphs?.map((paragraph: string, index: number) => (
          <div key={index} className="flex space-x-2 mb-2">
            <Textarea
              value={paragraph}
              onChange={(e) => {
                const newParagraphs = [...(editingContent.content?.paragraphs || [])];
                newParagraphs[index] = e.target.value;
                setEditingContent({
                  ...editingContent,
                  content: {
                    ...editingContent.content,
                    paragraphs: newParagraphs
                  }
                });
              }}
              rows={3}
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const newParagraphs = editingContent.content?.paragraphs?.filter((_: any, i: number) => i !== index) || [];
                setEditingContent({
                  ...editingContent,
                  content: {
                    ...editingContent.content,
                    paragraphs: newParagraphs
                  }
                });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            const newParagraphs = [...(editingContent.content?.paragraphs || []), ''];
            setEditingContent({
              ...editingContent,
              content: {
                ...editingContent.content,
                paragraphs: newParagraphs
              }
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Paragraph
        </Button>
      </div>
    </div>
  );

  const renderStatsEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={editingContent.title || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            title: e.target.value
          })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={editingContent.description || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            description: e.target.value
          })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Statistics</label>
        {editingContent.content?.stats?.map((stat: any, index: number) => (
          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
            <Input
              placeholder="Number"
              value={stat.number || ''}
              onChange={(e) => {
                const newStats = [...(editingContent.content?.stats || [])];
                newStats[index] = { ...stat, number: e.target.value };
                setEditingContent({
                  ...editingContent,
                  content: {
                    ...editingContent.content,
                    stats: newStats
                  }
                });
              }}
            />
            <Input
              placeholder="Label"
              value={stat.label || ''}
              onChange={(e) => {
                const newStats = [...(editingContent.content?.stats || [])];
                newStats[index] = { ...stat, label: e.target.value };
                setEditingContent({
                  ...editingContent,
                  content: {
                    ...editingContent.content,
                    stats: newStats
                  }
                });
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const newStats = editingContent.content?.stats?.filter((_: any, i: number) => i !== index) || [];
                setEditingContent({
                  ...editingContent,
                  content: {
                    ...editingContent.content,
                    stats: newStats
                  }
                });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            const newStats = [...(editingContent.content?.stats || []), { number: '', label: '' }];
            setEditingContent({
              ...editingContent,
              content: {
                ...editingContent.content,
                stats: newStats
              }
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Statistic
        </Button>
      </div>
    </div>
  );

  const renderTeamEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={editingContent.title || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            title: e.target.value
          })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={editingContent.description || ''}
          onChange={(e) => setEditingContent({
            ...editingContent,
            description: e.target.value
          })}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Team Members</label>
        {editingContent.content?.team?.map((member: any, index: number) => (
          <Card key={index} className="mb-4">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Name"
                  value={member.name || ''}
                  onChange={(e) => {
                    const newTeam = [...(editingContent.content?.team || [])];
                    newTeam[index] = { ...member, name: e.target.value };
                    setEditingContent({
                      ...editingContent,
                      content: {
                        ...editingContent.content,
                        team: newTeam
                      }
                    });
                  }}
                />
                <Input
                  placeholder="Role"
                  value={member.role || ''}
                  onChange={(e) => {
                    const newTeam = [...(editingContent.content?.team || [])];
                    newTeam[index] = { ...member, role: e.target.value };
                    setEditingContent({
                      ...editingContent,
                      content: {
                        ...editingContent.content,
                        team: newTeam
                      }
                    });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Experience"
                  value={member.experience || ''}
                  onChange={(e) => {
                    const newTeam = [...(editingContent.content?.team || [])];
                    newTeam[index] = { ...member, experience: e.target.value };
                    setEditingContent({
                      ...editingContent,
                      content: {
                        ...editingContent.content,
                        team: newTeam
                      }
                    });
                  }}
                />
                <Input
                  placeholder="Specialization"
                  value={member.specialization || ''}
                  onChange={(e) => {
                    const newTeam = [...(editingContent.content?.team || [])];
                    newTeam[index] = { ...member, specialization: e.target.value };
                    setEditingContent({
                      ...editingContent,
                      content: {
                        ...editingContent.content,
                        team: newTeam
                      }
                    });
                  }}
                />
              </div>
              <Input
                placeholder="Image URL"
                value={member.image || ''}
                onChange={(e) => {
                  const newTeam = [...(editingContent.content?.team || [])];
                  newTeam[index] = { ...member, image: e.target.value };
                  setEditingContent({
                    ...editingContent,
                    content: {
                      ...editingContent.content,
                      team: newTeam
                    }
                  });
                }}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const newTeam = editingContent.content?.team?.filter((_: any, i: number) => i !== index) || [];
                  setEditingContent({
                    ...editingContent,
                    content: {
                      ...editingContent.content,
                      team: newTeam
                    }
                  });
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Member
              </Button>
            </CardContent>
          </Card>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            const newTeam = [...(editingContent.content?.team || []), {
              name: '',
              role: '',
              experience: '',
              specialization: '',
              image: ''
            }];
            setEditingContent({
              ...editingContent,
              content: {
                ...editingContent.content,
                team: newTeam
              }
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>
    </div>
  );

  const renderEditor = () => {
    switch (editingContent.section) {
      case 'about_hero':
        return renderHeroEditor();
      case 'about_journey':
        return renderJourneyEditor();
      case 'about_stats':
        return renderStatsEditor();
      case 'about_team':
        return renderTeamEditor();
      default:
        return <div>Unknown section type</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {editingContent.section?.replace('_', ' ').replace('about ', '')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderEditor()}
        <div className="flex space-x-2">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutPageEditor;
