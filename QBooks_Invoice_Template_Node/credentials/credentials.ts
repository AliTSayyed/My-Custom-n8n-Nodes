import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class NoAuth implements ICredentialType {
	name = 'noAuth';
	displayName = 'No Authentication';
	documentationUrl = '';  // No documentation needed
	properties: INodeProperties[] = [];  // No credentials required
}
