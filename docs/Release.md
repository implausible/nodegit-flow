<a name="Release"></a>
## Release
All of this class' functions are attached to `NodeGit.Flow` or a `Flow` instance object

**Kind**: global class  

* [Release](#Release)
    * _instance_
        * [.startRelease(releaseVersion, options)](#Release+startRelease) ⇒ <code>Branch</code>
        * [.finishRelease(releaseVersion, options)](#Release+finishRelease) ⇒ <code>Commit</code>
    * _static_
        * [.startRelease(repo, releaseVersion, options)](#Release.startRelease) ⇒ <code>Branch</code>
        * [.finishRelease(repo, releaseVersion, options)](#Release.finishRelease) ⇒ <code>Commit</code>

<a name="Release+startRelease"></a>
### release.startRelease(releaseVersion, options) ⇒ <code>Branch</code>
Starts a git flow "release"

**Kind**: instance method of <code>[Release](#Release)</code>  
**Returns**: <code>Branch</code> - The nodegit branch for the release  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| releaseVersion | <code>String</code> | The version of the release to start |
| options | <code>Object</code> | Options for start release |

<a name="Release+finishRelease"></a>
### release.finishRelease(releaseVersion, options) ⇒ <code>Commit</code>
Finishes a git flow "release"

**Kind**: instance method of <code>[Release](#Release)</code>  
**Returns**: <code>Commit</code> - The commit created by finishing the release  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| releaseVersion | <code>String</code> | The name of the release to finish |
| options | <code>Object</code> | Options for finish release |

<a name="Release.startRelease"></a>
### Release.startRelease(repo, releaseVersion, options) ⇒ <code>Branch</code>
Starts a git flow "release"

**Kind**: static method of <code>[Release](#Release)</code>  
**Returns**: <code>Branch</code> - The nodegit branch for the release  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| repo | <code>Object</code> | The repository to start a release in |
| releaseVersion | <code>String</code> | The version of the release to start |
| options | <code>Object</code> | Options for start release |

<a name="Release.finishRelease"></a>
### Release.finishRelease(repo, releaseVersion, options) ⇒ <code>Commit</code>
Finishes a git flow "release"

**Kind**: static method of <code>[Release](#Release)</code>  
**Returns**: <code>Commit</code> - The commit created by finishing the release  
**Async**:   

| Param | Type | Description |
| --- | --- | --- |
| repo | <code>Object</code> | The repository to finish a release in |
| releaseVersion | <code>String</code> | The name of the release to finish |
| options | <code>Object</code> | Options for finish release |

