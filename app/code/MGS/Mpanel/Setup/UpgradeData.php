<?php
/**
* Copyright © 2016 SW-THEMES. All rights reserved.
*/

namespace MGS\Mpanel\Setup;

use Magento\Framework\Module\Setup\Migration;
use Magento\Framework\Setup\UpgradeDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Catalog\Setup\CategorySetupFactory;
use Magento\Eav\Setup\EavSetup;
use Magento\Eav\Setup\EavSetupFactory;

/**
 * @codeCoverageIgnore
 */
class UpgradeData implements UpgradeDataInterface
{
    /**
     * Category setup factory
     *
     * @var CategorySetupFactory
     */
    private $categorySetupFactory;
	
	private $eavSetupFactory;
 
    /**
     * Init
     *
     * @param CategorySetupFactory $categorySetupFactory
     */
    public function __construct(CategorySetupFactory $categorySetupFactory, EavSetupFactory $eavSetupFactory)
    {
        $this->categorySetupFactory = $categorySetupFactory;
		$this->eavSetupFactory = $eavSetupFactory;
    }
    
    /**
     * {@inheritdoc}
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function upgrade(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $installer = $setup;
        $installer->startSetup();
        if (version_compare($context->getVersion(), '1.0.0', '<=')) {
            // set new resource model paths
            /** @var \Magento\Catalog\Setup\CategorySetup $categorySetup */
            
            $categorySetup = $this->categorySetupFactory->create(['setup' => $setup]);
            $entityTypeId = $categorySetup->getEntityTypeId(\Magento\Catalog\Model\Category::ENTITY);
            $attributeSetId = $categorySetup->getDefaultAttributeSetId($entityTypeId);
            
            $categories_attributes = [
                'category_full_width' => [
                    'type' => 'int',
                    'label' => 'Full Width Layout',
                    'input' => 'select',
                    'required' => false,
                    'sort_order' => 87,
					'default' => '0',
					'source' => 'Magento\Eav\Model\Entity\Attribute\Source\Boolean',
                    'group' => 'Display Settings'
                ]
            ];
            
            foreach($categories_attributes as $item => $data) {
                $categorySetup->addAttribute(\Magento\Catalog\Model\Category::ENTITY, $item, $data);
            }
            
            $idg =  $categorySetup->getAttributeGroupId($entityTypeId, $attributeSetId, 'Display Settings');
            
            foreach($categories_attributes as $item => $data) {
                $categorySetup->addAttributeToGroup(
                    $entityTypeId,
                    $attributeSetId,
                    $idg,
                    $item,
                    $data['sort_order']
                );
            }
        }
		
		if (version_compare($context->getVersion(), '1.0.1', '<=')) {
            $eavSetup = $this->eavSetupFactory->create(['setup' => $setup]);
			$productTypes = [
				\Magento\Catalog\Model\Product\Type::TYPE_SIMPLE,
				\Magento\ConfigurableProduct\Model\Product\Type\Configurable::TYPE_CODE,
				\Magento\Catalog\Model\Product\Type::TYPE_VIRTUAL,
				\Magento\Downloadable\Model\Product\Type::TYPE_DOWNLOADABLE,
				\Magento\Catalog\Model\Product\Type::TYPE_BUNDLE,
			];
			$productTypes = join(',', $productTypes);
			$eavSetup->addAttribute(
				\Magento\Catalog\Model\Product::ENTITY,
				'mgs_j360',
				[
					'group' => 'Product Details',
					'sort_order' => 151,
					'default' => '0',
					'type' => 'int',
					'backend' => '',
					'frontend' => '',
					'label' => '360 Degrees Image View',
					'input' => 'boolean',
					'class' => '',
					'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
					'source' => 'Magento\Eav\Model\Entity\Attribute\Source\Boolean',
					'visible' => true,
					'required' => false,
					'user_defined' => true,
					'searchable' => false,
					'filterable' => false,
					'comparable' => false,
					'visible_in_advanced_search' => false,
					'visible_on_front' => false,
					'used_in_product_listing' => true,
					'unique' => false,
					'apply_to' => $productTypes,
					'is_used_in_grid' => false,
					'is_visible_in_grid' => false,
					'is_filterable_in_grid' => false
				]
			);
        }
        
        $setup->endSetup();
    }
}
